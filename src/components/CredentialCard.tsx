import { useState } from "react";
import { callPresentCredentialOnChain, explorerTxUrl, OnChainResult } from "../lib/onchain";

export interface GateState {
  resourceName: string;
  requiredTier: number;
  verifiedCount: number;
  usedNullifiers: Set<string>;
  gateOpen: boolean;
}

type Phase = "unissued" | "ready" | "proving" | "awaiting_signature" | "done" | "error";

const TIERS = [1, 2, 3, 4, 5];

function randomSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function CredentialCard({
  gate,
  onVerified,
  walletApi,
  walletStatus,
}: {
  gate: GateState;
  onVerified: (nullifier?: string) => void;
  walletApi: { coinPublicKey: string; provider?: unknown; walletName?: string } | null;
  walletStatus: string;
}) {
  const [secret, setSecret] = useState<string | null>(null);
  const [tier, setTier] = useState<number>(3);
  const [issuedTier, setIssuedTier] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("unissued");
  const [txResult, setTxResult] = useState<OnChainResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleIssue() {
    const s = randomSecret();
    setSecret(s);
    setIssuedTier(tier);
    setPhase("ready");
  }

  async function handlePresent() {
    let currentSecret = secret;
    if (phase === "error" || !currentSecret) {
      currentSecret = randomSecret();
      setSecret(currentSecret);
    }
    if (issuedTier === null) return;
    setErrorMsg(null);

    if (!walletApi) {
      setErrorMsg("Please connect your wallet to present a credential on-chain.");
      setPhase("error");
      return;
    }

    setPhase("awaiting_signature");
    const result = await callPresentCredentialOnChain(currentSecret, issuedTier, walletApi);
    if (result.ok) {
      setTxResult(result);
      setPhase("done");
      onVerified(result.nullifier);
    } else {
      let friendlyError = result.error;
      if (result.error.includes("182")) {
        friendlyError = "Transaction rejected by node (Error 182). A fresh credential secret has been generated. Please wait ~30 seconds for your DUST to mature and try again.";
        setSecret(randomSecret());
      } else if (result.error.includes("temporarily banned")) {
        friendlyError = "Your wallet is temporarily rate-limited. Please wait ~60 seconds and try again.";
        setSecret(randomSecret());
      }
      setErrorMsg(friendlyError);
      setPhase("error");
    }
  }

  if (!gate.gateOpen && phase !== "done") {
    return (
      <div className="p-10 text-center">
        <p className="font-display text-2xl text-paper">This gate has closed.</p>
        <p className="text-sm text-paper-dim mt-2">
          Verifications already recorded remain valid.
        </p>
      </div>
    );
  }

  const walletConnected = walletStatus === "connected" && !!walletApi;

  return (
    <div>
      <div className="p-9">
        <p className="font-mono text-[11px] tracking-widest text-gold-dim uppercase">
          gate · {gate.resourceName}
        </p>
        <h2 className="font-display text-2xl text-paper mt-2 mb-2">
          {gate.resourceName}
        </h2>
        <p className="text-sm text-paper-dim mb-8">
          Requires a credential at Tier {gate.requiredTier} or above.
        </p>

        {!walletConnected && phase === "unissued" && (
          <div className="mb-6 px-4 py-3 border border-gold/20 bg-gold/5 rounded-sm flex items-center gap-3">
            <span className="text-gold text-base">⚠</span>
            <p className="text-sm text-paper-dim">
              Connect your 1AM wallet to submit real on-chain proofs.
            </p>
          </div>
        )}

        {phase === "unissued" && (
          <div className="space-y-5">
            <p className="text-sm text-paper-dim leading-relaxed">
              Choose the tier your credential was issued at. This value stays on
              your device — never disclosed, even when it clears the gate.
            </p>
            <div className="flex gap-2.5">
              {TIERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`flex-1 font-mono text-sm rounded-sm py-2.5 border transition-colors ${
                    tier === t
                      ? "border-gold text-gold-light bg-gold/10"
                      : "border-ink-line text-paper-faint hover:border-paper-faint/60"
                  }`}
                >
                  T{t}
                </button>
              ))}
            </div>
            <button
              onClick={handleIssue}
              className="w-full font-mono text-sm text-ink bg-paper rounded-sm py-3.5 hover:bg-paper/90 transition-colors uppercase tracking-widest"
            >
              issue credential
            </button>
          </div>
        )}

        {phase === "done" && (
          <div className="space-y-5">
            <div className="seal-settle border border-signal-ok/30 bg-signal-ok/5 rounded-sm px-5 py-4 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 12l5 5L20 6" stroke="#5FA97C" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm text-paper font-medium">
                Credential verified — access granted.
              </span>
            </div>

            {txResult?.ok && (
              <div className="border border-ink-line rounded-sm p-5 bg-ink-raised space-y-3">
                <p className="text-[10px] text-gold-dim uppercase tracking-widest">
                  On-chain transaction
                </p>
                <p className="font-mono text-xs text-paper-dim break-all">
                  {txResult.txId}
                </p>
                <a
                  href={explorerTxUrl(txResult.txId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="tx-explorer-link"
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-gold-light border border-gold/25 rounded-sm px-4 py-2 hover:bg-gold/10 transition-colors"
                >
                  ↗ verify on Midnight Explorer
                </a>
                <p className="text-[11px] text-paper-faint mt-1">
                  This transaction is publicly verifiable on Midnight Preprod.
                </p>
              </div>
            )}

            {(!txResult || !txResult.ok) && (
              <div className="border border-signal-err/30 rounded-sm p-5 bg-signal-err/5 space-y-2">
                <p className="text-[10px] text-signal-err uppercase tracking-widest">error</p>
                <p className="font-mono text-sm text-paper break-all">
                  Transaction failed.
                </p>
              </div>
            )}
          </div>
        )}

        {(phase === "ready" || phase === "proving" || phase === "awaiting_signature" || phase === "error") && (
          <div className="space-y-5">
            <div className="border border-ink-line rounded-sm px-5 py-4 flex items-center justify-between bg-ink-raised">
              <span className="text-sm text-paper-dim">Holding a credential</span>
              <span className="font-mono text-[10px] text-gold-dim uppercase tracking-widest border border-gold/20 px-2 py-1 rounded-sm">tier withheld</span>
            </div>

            {phase === "awaiting_signature" && (
              <div className="border border-gold/20 bg-gold/5 rounded-sm px-5 py-4 flex items-center gap-4">
                <span className="inline-block h-5 w-5 rounded-full border-2 border-gold/25 border-t-gold animate-spin shrink-0" />
                <div>
                  <p className="text-sm text-paper font-medium">
                    Waiting for wallet signature…
                  </p>
                  <p className="text-xs text-paper-dim mt-1">
                    Check your wallet popup to approve the transaction.
                  </p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="space-y-3">
                <p className="text-sm text-paper border border-signal-err/25 bg-signal-err/5 rounded-sm px-5 py-4 leading-relaxed">
                  {errorMsg}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setPhase("unissued");
                  }}
                  className="text-[11px] font-mono text-paper-faint hover:text-paper uppercase tracking-widest w-full py-2 transition-colors"
                >
                  ← choose tier / issue fresh credential
                </button>
              </div>
            )}

            <button
              onClick={handlePresent}
              disabled={phase === "proving" || phase === "awaiting_signature"}
              id="present-credential-btn"
              className="w-full font-mono text-sm text-ink bg-gold hover:bg-gold-light rounded-sm py-3.5 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {phase === "proving" ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-ink/30 border-t-ink animate-spin" />
                  generating proof…
                </>
              ) : phase === "awaiting_signature" ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-ink/30 border-t-ink animate-spin" />
                  awaiting signature…
                </>
              ) : walletConnected ? (
                "prove & submit on-chain ↗"
              ) : (
                "prove & present credential"
              )}
            </button>

            {walletConnected && phase === "ready" && (
              <p className="text-xs text-paper-faint text-center">
                Your wallet will open for signature approval.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="px-9 py-4 border-t border-ink-line flex justify-between items-center">
        <span className="font-mono text-[11px] text-paper-faint uppercase tracking-wider">
          {gate.verifiedCount} verification{gate.verifiedCount === 1 ? "" : "s"} recorded
        </span>
        <span className="font-mono text-[11px] text-gold-dim uppercase tracking-widest">
          {gate.gateOpen ? "open" : "closed"}
        </span>
      </div>
    </div>
  );
}
