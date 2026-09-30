import { useState } from "react";
import { Header } from "./components/Header";
import { CredentialCard } from "./components/CredentialCard";
import { VerificationLedger } from "./components/VerificationLedger";
import { PrivacyLedger } from "./components/PrivacyLedger";
import { useLaceWallet, WalletId } from "./hooks/useLaceWallet";
import { WalletConnectModal } from "./components/WalletConnectModal";
import { explorerContractUrl } from "./lib/onchain";

const RESOURCE_NAME = "Verified Builders Channel";
const REQUIRED_TIER = 3;

function App() {
  const wallet = useLaceWallet();
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [usedNullifiers, setUsedNullifiers] = useState<Set<string>>(new Set());
  const [, forceRender] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const gateState = {
    resourceName: RESOURCE_NAME,
    requiredTier: REQUIRED_TIER,
    verifiedCount,
    usedNullifiers,
    gateOpen: true,
  };

  function handleConnectRequest() {
    wallet.refreshAvailableWallets();
    setShowModal(true);
  }

  async function handleSelectWallet(walletId: WalletId) {
    setShowModal(false);
    await wallet.connect(walletId);
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      {showModal && (
        <WalletConnectModal
          wallets={wallet.availableWallets}
          onSelectWallet={handleSelectWallet}
          onCancel={() => setShowModal(false)}
        />
      )}

      <Header
        status={wallet.status}
        address={wallet.address}
        walletName={wallet.connectedWalletName}
        error={wallet.error}
        onConnect={handleConnectRequest}
        onDisconnect={wallet.disconnect}
      />

      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-20">
        <section className="mb-16">
          <p className="font-mono text-[11px] text-gold-dim uppercase tracking-[0.2em] mb-4">
            first quarter · midnight preprod
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] text-paper leading-[1.2] max-w-xl mb-5">
            Prove who vouches for you, without showing them the paper.
          </h1>
          <p className="text-paper-dim text-base sm:text-lg leading-relaxed max-w-lg">
            Present a credential below. The gate checks it was genuinely
            issued and meets the required tier — recording only that a
            valid credential passed, never which one.
          </p>
          <a
            href={explorerContractUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs text-paper-faint hover:text-gold-light transition-colors mt-8 uppercase tracking-widest border-b border-transparent hover:border-gold-light/40 pb-0.5"
          >
            View contract on Midnight Explorer ↗
          </a>
        </section>

        <section className="mb-12">
          <div className="plate overflow-hidden">
            <CredentialCard
              gate={gateState}
              onVerified={(nullifier) => {
                setVerifiedCount((c) => c + 1);
                if (nullifier) {
                  setUsedNullifiers((prev) => {
                    const next = new Set(prev);
                    next.add(nullifier);
                    return next;
                  });
                }
                forceRender((n) => n + 1);
              }}
              walletApi={wallet.api}
              walletStatus={wallet.status}
            />
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <VerificationLedger gate={gateState} />
          <PrivacyLedger />
        </section>
      </main>

      <footer className="border-t border-ink-line mt-auto">
        <div className="mx-auto max-w-3xl px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-mono text-[10px] text-paper-faint uppercase tracking-widest">
            built on midnight · compact contracts
          </p>
          <p className="font-mono text-[10px] text-paper-faint uppercase tracking-widest">
            level 3 · first quarter submission
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
