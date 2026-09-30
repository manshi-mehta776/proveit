import { GateState } from "./CredentialCard";

export function VerificationLedger({ gate }: { gate: GateState }) {
  return (
    <div className="border border-ink-line rounded-md p-7 bg-ink-panel">
      <div className="flex items-baseline justify-between mb-7">
        <h3 className="font-display text-lg text-paper">Verification Ledger</h3>
        <span className="font-mono text-[10px] text-gold-dim uppercase tracking-widest border border-gold/20 px-2 py-1 rounded-sm">
          live · on-chain
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-ink-line rounded-sm p-4">
          <p className="font-mono text-3xl text-paper">
            {gate.verifiedCount}
          </p>
          <p className="text-xs text-paper-faint mt-2">credentials verified</p>
        </div>
        <div className="border border-ink-line rounded-sm p-4">
          <p className="font-mono text-3xl text-gold-light">
            {gate.requiredTier}+
          </p>
          <p className="text-xs text-paper-faint mt-2">minimum tier required</p>
        </div>
      </div>

      <p className="font-mono text-[11px] text-paper-faint mt-7 pt-5 border-t border-ink-line flex justify-between uppercase tracking-wider">
        <span>{gate.usedNullifiers.size} nullifier{gate.usedNullifiers.size === 1 ? "" : "s"}</span>
        <span className="text-gold-dim">gate is {gate.gateOpen ? "open" : "closed"}</span>
      </p>
    </div>
  );
}
