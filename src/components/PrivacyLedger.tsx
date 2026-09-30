export function PrivacyLedger() {
  return (
    <div className="border border-ink-line rounded-md p-7 bg-ink-panel">
      <h3 className="font-display text-lg text-paper mb-6">
        What an observer can see
      </h3>

      <div className="grid sm:grid-cols-2 gap-7">
        <div>
          <p className="font-mono text-[10px] text-signal-ok uppercase tracking-widest mb-3">public</p>
          <ul className="space-y-2 text-sm text-paper-dim">
            <li className="flex gap-2 items-start"><span className="text-paper-faint">·</span> the gated resource's name</li>
            <li className="flex gap-2 items-start"><span className="text-paper-faint">·</span> the minimum tier the gate requires</li>
            <li className="flex gap-2 items-start"><span className="text-paper-faint">·</span> the running count of successful verifications</li>
            <li className="flex gap-2 items-start"><span className="text-paper-faint">·</span> the set of spent credential nullifiers</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] text-gold-dim uppercase tracking-widest mb-3">private</p>
          <ul className="space-y-2 text-sm text-paper-dim">
            <li className="flex gap-2 items-start"><span className="text-paper-faint">·</span> the credential secret itself</li>
            <li className="flex gap-2 items-start"><span className="text-paper-faint">·</span> the holder's exact tier (only "≥ required" is proved)</li>
            <li className="flex gap-2 items-start"><span className="text-paper-faint">·</span> any link between a nullifier and a holder's identity</li>
            <li className="flex gap-2 items-start"><span className="text-paper-faint">·</span> which credential passed at which moment</li>
          </ul>
        </div>
      </div>

      <div className="mt-7 pt-6 border-t border-ink-line">
        <p className="text-sm text-paper-dim leading-relaxed">
          Each presentation proves, in zero-knowledge, that the caller
          holds a credential issued by the trusted issuer, at or above the
          required tier, and hasn't used it here before —{" "}
          <em className="not-italic text-paper font-medium">
            without revealing which credential, or its exact tier
          </em>
          .
        </p>
      </div>
    </div>
  );
}
