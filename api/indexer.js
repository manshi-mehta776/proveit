// Vercel serverless function — proxies requests to the Midnight Preprod indexer
// to avoid CORS issues in the browser (indexer returns CORS headers only for
// direct server-to-server calls, not for browser preflight in some configs).

const INDEXER_URL = "https://indexer.preprod.midnight.network/api/v4/graphql";

export default async function handler(req, res) {
  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const upstream = await fetch(INDEXER_URL, {
      method: "POST",
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        "Accept": req.headers["accept"] || "application/graphql-response+json, application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.status(upstream.status).json(data);
  } catch (err) {
    console.error("Indexer proxy error:", err);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(502).json({ error: "Bad Gateway", detail: String(err) });
  }
}
