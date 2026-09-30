import sodium from 'libsodium-wrappers';
import crypto from 'crypto';

const token = process.env.GH_TOKEN;
const repo = 'lilawti-lila620/PROOVEIT';
const secretName = 'WALLET_SEED';

// Generate a random 32-byte hex string (64 chars)
const secretValue = crypto.randomBytes(32).toString('hex');
console.log("Generated random hex seed for deployment.");

async function run() {
  await sodium.ready;

  // Get public key
  const keyResponse = await fetch(`https://api.github.com/repos/${repo}/actions/secrets/public-key`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  
  if (!keyResponse.ok) {
    console.error('Failed to get key', await keyResponse.text());
    return;
  }

  const keyData = await keyResponse.json();
  const keyId = keyData.key_id;
  const keyBase64 = keyData.key;

  // Convert keys
  const binkey = sodium.from_base64(keyBase64, sodium.base64_variants.ORIGINAL);
  const binsec = sodium.from_string(secretValue);

  // Encrypt
  const encBytes = sodium.crypto_box_seal(binsec, binkey);
  const encryptedValue = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);

  // Upload secret
  const putResponse = await fetch(`https://api.github.com/repos/${repo}/actions/secrets/${secretName}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      encrypted_value: encryptedValue,
      key_id: keyId,
    }),
  });

  if (!putResponse.ok) {
    console.error('Failed to upload secret', await putResponse.text());
  } else {
    console.log('Secret uploaded successfully!');
  }
}

run();
