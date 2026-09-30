import { WalletStatus } from "../hooks/useLaceWallet";
import { explorerContractUrl } from "../lib/onchain";

function truncate(addr: string) {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export function Header({
  status,
  address,
  walletName,
  error,
  onConnect,
  onDisconnect,
}: {
  status: WalletStatus;
  address: string | null;
  walletName?: string | null;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <header className="border-b border-ink-line bg-ink/90 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <svg width="30" height="30" viewBox="0 0 64 64" className="shrink-0">
            <circle cx="32" cy="32" r="17" fill="none" stroke="#C9A24B" strokeWidth="1.5" />
            <circle cx="32" cy="32" r="3.5" fill="#C9A24B" />
            <path d="M32 11 V15.5 M32 48.5 V53 M11 32 H15.5 M48.5 32 H53" stroke="#C9A24B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div>
            <p className="font-display text-xl text-paper leading-none tracking-wide">ProoveIt</p>
            <p className="font-mono text-[10px] text-paper-faint uppercase tracking-[0.15em] mt-1">
              zero-knowledge credential gate
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {status === "connected" && address ? (
            <div className="flex items-center gap-3">
              {walletName && (
                <span className="font-mono text-[10px] text-gold-light border border-gold/25 px-2.5 py-1 rounded-sm uppercase tracking-widest">
                  {walletName}
                </span>
              )}
              <span className="font-mono text-xs text-paper-dim border border-ink-line px-3 py-1.5 rounded-sm">
                {truncate(address)}
              </span>
              <button
                onClick={onDisconnect}
                className="font-mono text-[10px] text-paper-faint border border-ink-line rounded-sm px-3 py-1.5 hover:border-signal-err/40 hover:text-signal-err transition-colors uppercase tracking-widest"
                title="Disconnect wallet"
              >
                disconnect
              </button>
              <a
                href={explorerContractUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-paper-faint hover:text-gold-light transition-colors uppercase tracking-widest"
              >
                view contract ↗
              </a>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={status === "connecting"}
              id="connect-wallet-btn"
              className="font-mono text-xs font-medium text-ink bg-gold rounded-sm px-5 py-2.5 hover:bg-gold-light transition-colors disabled:opacity-50 uppercase tracking-widest"
            >
              {status === "connecting" ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-ink/30 border-t-ink animate-spin" />
                  connecting…
                </span>
              ) : (
                "connect wallet"
              )}
            </button>
          )}
          {(status === "unavailable" || status === "error") && error && (
            <p className="text-[11px] text-signal-err max-w-[280px] text-right font-mono">
              {error}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
