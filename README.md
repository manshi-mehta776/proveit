# ProoveIt
[![CI](https://github.com/manshi-mehta776/proveit/actions/workflows/ci.yml/badge.svg)](https://github.com/manshi-mehta776/proveit/actions/workflows/ci.yml)
> Prove a credential is valid — and meets a threshold — without disclosing it. Built on Midnight.

### 🌟 Quick Links for Reviewers
- 📄 **[Read the full Product Proposal (PROPOSAL.md)](./PROPOSAL.md)**
- 🧪 **[View the Test Suite (Circuit, State, & Privacy Tests)](./tests)**
- 🕵️ **[Read our Privacy Model & Claims](#privacy-model)**

## Live Demo
🌐 **[https://proveit-weld.vercel.app](https://proveit-weld.vercel.app)**

## Demo Video
🎥 [Watch the 1-Minute Walkthrough Video (Google Drive)](https://drive.google.com/file/d/1yJdPQfqIaX36PHnizjxLoEvQMeaF1GKn/view?usp=sharing)

## Contract Address
| Network  | Address                                                            |
|----------|--------------------------------------------------------------------|
| Preprod  | `ce8ac13a27ce7a4f29436e0572967ee537c4c3bde78719e0a9729d00ea1f3efb` |

- 🔍 **Contract on Midnight Explorer:** [Contract 0xce8ac13a… | Midnight Explorer](https://preprod.midnightexplorer.com/contracts/0xce8ac13a27ce7a4f29436e0572967ee537c4c3bde78719e0a9729d00ea1f3efb)

![Preprod Contract Explorer](./screenshots/contract%20onchain.png)

## What This Does
ProoveIt lets an organization or issuer open a "gate" in front of a restricted resource—such as a developer channel, a grant distribution pool, an exclusive voting round, or an accredited community.

The gate requires a credential at or above a specified tier. Using zero-knowledge proofs on Midnight, credential holders prove that they possess a genuine credential meeting the qualification tier without ever disclosing:
- The credential secret or private seed
- Their exact tier score above the required threshold
- Their real-world identity or wallet linkability

The application generates a client-side zero-knowledge proof, pays network fees using Midnight DUST, balances the transaction with 1AM Wallet, and submits the proof on-chain to the Preprod network, leaving only a cryptographic nullifier and an incremented verification counter.

![Interactive Product UI](./screenshots/product%20ui.png)

## Privacy Model
- PUBLIC:
  - The gated resource name (e.g., "Verified Builders Channel")
  - The minimum required tier threshold (e.g., Tier 3)
  - The total verified presentation count recorded on the contract
  - The set of spent nullifier hashes (used to strictly prevent double-presentation)
- PRIVATE:
  - The credential secret key and witness data
  - The holder's exact tier score (concealed whether it is Tier 3, 4, or 5)
  - The link between the holder's wallet/identity and the spent nullifier
- PROVED without revealing:
  - Proved that the caller holds a valid credential whose tier is greater than or equal to the gate's required threshold, and that this credential has not been previously spent at this gate—without revealing the credential secret or the exact tier value.

## Privacy Claim
An on-chain observer or verifier can see the total number of credentials that have cleared the gate at any time, and can verify that no credential has been submitted twice (since the nullifier set only grows monotonically). What an observer cannot see or infer at any point:
1. Whose credential was used (no wallet or identity link exists in the proof or ledger state).
2. The exact tier or score of the holder (the proof only establishes the inequality `tier >= requiredTier`).
3. Which nullifier belongs to which holder or off-chain credential.

## Tech Stack
- **ZK Smart Contract:** Compact (`contracts/credential.compact`) compiled with Midnight Compact compiler
- **Network:** Midnight Preprod
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Wallet Connection:** 1AM Wallet (with DUST registration and native transaction balancing)
- **Testing:** Vitest (comprehensive unit, state transition, circuit logic, and privacy test suites)
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`)
- **Deployment:** Vercel ([proveit-weld.vercel.app](https://proveit-weld.vercel.app))

## Prerequisites
- Node.js v22+
- npm v10+
- [1AM Wallet](https://1am.xyz) browser extension (configured for Midnight Preprod network, with registered DUST)

## Setup & Run Locally
```bash
# 1. Clone the repository
git clone https://github.com/manshi-mehta776/proveit.git
cd proveit

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 4. Build for production
npm run build
```

## Run Tests
```
npm test
```

![Test Suite Output](./screenshots/test%20output.png)

## CI/CD
The repository uses GitHub Actions (`.github/workflows/ci.yml`) configured to automatically trigger on every `push` and `pull_request` to the `main` branch.

The pipeline performs the following steps:
1. Checks out the code repository.
2. Installs Node.js v22 with npm cache.
3. Installs and configures the Midnight Compact compiler toolchain.
4. Compiles the Compact contract and builds generated TypeScript contract bindings.
5. Installs frontend dependencies.
6. Runs code linting (`npm run lint`).
7. Executes the automated test suite (`npm test` — covering circuit logic, state transitions, and privacy verification).
8. Builds the production bundle (`npm run build`).

A status badge is located at the top of this README showing live workflow status.

## Screenshots & Verification

| Screenshot | Description |
| :--- | :--- |
| **Product UI**<br>![Product UI](./screenshots/product%20ui.png) | Interactive dApp interface with live 1AM Wallet integration, credential selection, ZK proof generation, and verification status. |
| **Contract Explorer**<br>![Contract Explorer](./screenshots/contract%20onchain.png) | Midnight Explorer contract page for `ce8ac13a27…` showing contract state, actions, and verification history.<br>🔗 [View on Midnight Explorer](https://preprod.midnightexplorer.com/contracts/0xce8ac13a27ce7a4f29436e0572967ee537c4c3bde78719e0a9729d00ea1f3efb) |
| **Test Output (8 Passing)**<br>![Tests Output](./screenshots/test%20output.png) | Vitest test execution output showing 8 passing tests across `tests/counter.test.ts` and `tests/credential.test.ts`. |

## Product Proposal
See [PROPOSAL.md](./PROPOSAL.md) for the complete product specification, target user personas, Midnight architectural rationale, data model, and roadmap to Mainnet.
