// server.js (Node 18+ / ESM)
import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Config: ganti TARGET_BASE jika docs menyebut host lain
const TARGET_BASE = process.env.TARGET_BASE || "https://agentrouter.org";
const TOKEN = process.env.AGENTROUTER_TOKEN;
if (!TOKEN) {
  console.warn("WARNING: AGENTROUTER_TOKEN not set in environment. Proxy requests will 401.");
}

// Proxy route: semua request ke /proxy/* akan diteruskan ke TARGET_BASE
app.all("/proxy/*", async (req, res) => {
  try {
    const targetPath = req.originalUrl.replace(/^\/proxy/, "");
    // Build target URL including querystring
    const qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    const url = TARGET_BASE + targetPath + qs;

    // Build headers
    const headers = {};
    // Forward content-type if present
    if (req.headers["content-type"]) headers["Content-Type"] = req.headers["content-type"];
    // Add Authorization header with token from env
    if (TOKEN) headers["Authorization"] = `Bearer ${TOKEN}`;

    const fetchOptions = {
      method: req.method,
      headers,
      // body only for methods that can have body
      body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body),
    };

    const apiRes = await fetch(url, fetchOptions);

    // Copy selected response headers (avoid hop-by-hop headers)
    apiRes.headers.forEach((v, k) => {
      // Skip certain headers that Express manages
      if (["transfer-encoding", "content-encoding", "content-length", "connection"].includes(k.toLowerCase())) return;
      res.setHeader(k, v);
    });

    res.status(apiRes.status);
    const buffer = Buffer.from(await apiRes.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server listening on http://localhost:${PORT}`));
