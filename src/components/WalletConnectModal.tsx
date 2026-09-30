import { useState } from "react";
import { DiscoveredWallet, WalletId } from "../hooks/useLaceWallet";

export function WalletConnectModal({
  wallets,
  onSelectWallet,
  onCancel,
}: {
  wallets: DiscoveredWallet[];
  onSelectWallet: (walletId: WalletId) => void;
  onCancel: () => void;
}) {
  const has1am = wallets.find((w) => w.id === "1am" && w.installed);
  const hasLace = wallets.find((w) => w.id === "lace" && w.installed);
  const [selectedWalletId, setSelectedWalletId] = useState<WalletId>(
    has1am ? "1am" : hasLace ? "lace" : "1am"
  );

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="modal-rise bg-ink-panel border border-ink-line rounded-md w-full max-w-md overflow-hidden">
          <div className="px-8 pt-7 pb-5 border-b border-ink-line flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <svg width="28" height="28" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="17" fill="none" stroke="#C9A24B" strokeWidth="1.5" />
                <circle cx="32" cy="32" r="3.5" fill="#C9A24B" />
              </svg>
              <div>
                <p id="wallet-modal-title" className="font-display text-lg text-paper">
                  Connect Wallet
                </p>
                <p className="font-mono text-[10px] text-gold-dim uppercase tracking-widest mt-0.5">
                  Midnight Preprod
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-paper-faint hover:text-paper font-mono text-lg px-2 py-1 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="px-8 py-6 space-y-5">
            <p className="text-sm text-paper-dim leading-relaxed">
              Select your Midnight wallet to sign transactions and submit zero-knowledge proofs on-chain:
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setSelectedWalletId("1am")}
                className={`w-full flex items-center justify-between p-4 rounded-sm border transition-colors text-left ${
                  selectedWalletId === "1am"
                    ? "border-gold bg-gold/5"
                    : "border-ink-line hover:border-paper-faint/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-ink-raised border border-ink-line flex items-center justify-center shrink-0">
                    <span className="font-display text-sm text-gold-light tracking-wider">1AM</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-medium text-paper">1AM Wallet</span>
                      {has1am ? (
                        <span className="font-mono text-[9px] uppercase tracking-widest text-signal-ok border border-signal-ok/30 px-1.5 py-0.5 rounded-sm">
                          Detected
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] uppercase tracking-widest text-paper-faint border border-ink-line px-1.5 py-0.5 rounded-sm">
                          Extension
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-paper-faint mt-1">
                      Delegated proof provider &amp; dust sponsorship
                    </p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedWalletId === "1am" ? "border-gold" : "border-ink-line"}`}>
                  {selectedWalletId === "1am" && <div className="w-2 h-2 rounded-full bg-gold" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedWalletId("lace")}
                className={`w-full flex items-center justify-between p-4 rounded-sm border transition-colors text-left ${
                  selectedWalletId === "lace"
                    ? "border-gold bg-gold/5"
                    : "border-ink-line hover:border-paper-faint/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-ink-raised border border-ink-line flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" stroke="#C9A24B" strokeWidth="1.8" />
                      <circle cx="12" cy="12" r="2.5" fill="#C9A24B" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-medium text-paper">Lace Wallet</span>
                      {hasLace ? (
                        <span className="font-mono text-[9px] uppercase tracking-widest text-signal-ok border border-signal-ok/30 px-1.5 py-0.5 rounded-sm">
                          Detected
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] uppercase tracking-widest text-paper-faint border border-ink-line px-1.5 py-0.5 rounded-sm">
                          Extension
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-paper-faint mt-1">
                      Midnight Lace connector (Preprod)
                    </p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedWalletId === "lace" ? "border-gold" : "border-ink-line"}`}>
                  {selectedWalletId === "lace" && <div className="w-2 h-2 rounded-full bg-gold" />}
                </div>
              </button>
            </div>

            <div className="border border-ink-line rounded-sm p-4 space-y-2.5">
              {[
                "Wallet prompt appears to authorize each on-chain transaction",
                "Every proof is recorded on Midnight Preprod blockchain",
                "Transaction hash links directly to Midnight Explorer",
                "Zero-knowledge privacy: credential secrets stay in your browser",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
                    <path d="M4 12l5 5L20 6" stroke="#C9A24B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs text-paper-dim leading-tight">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs px-1 pt-1">
              <span className="font-mono text-[10px] uppercase text-paper-faint tracking-wider">
                Midnight Preprod
              </span>
              <span className="font-mono text-[10px] uppercase text-paper-faint tracking-wider">
                Auto-reconnect enabled
              </span>
            </div>
          </div>

          <div className="px-8 pb-8 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 font-mono text-[11px] uppercase tracking-widest text-paper-faint border border-ink-line rounded-sm py-3.5 hover:border-paper-faint/50 hover:text-paper transition-colors"
            >
              cancel
            </button>
            <button
              type="button"
              onClick={() => onSelectWallet(selectedWalletId)}
              id="wallet-modal-confirm-btn"
              className="flex-1 font-mono text-[11px] uppercase tracking-widest bg-gold text-ink rounded-sm py-3.5 hover:bg-gold-light transition-colors"
            >
              connect {selectedWalletId === "1am" ? "1AM" : "Lace"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
