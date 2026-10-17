// Tiny static file server for the prebuilt site (copied to the `deploy` branch as server.js).
// No dependencies: Hostinger only runs `npm start` — nothing is installed or compiled there.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  p = path.normalize(p).replace(/^(\.\.[/\\])+/, "");
  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
  return fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
}

http
  .createServer((req, res) => {
    const file = resolve(req.url || "/");
    const target = file || path.join(ROOT, "404.html");
    const ext = path.extname(target);
    res.writeHead(file ? 200 : 404, {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      // Hashed build assets never change; pages are always re-checked.
      "Cache-Control": req.url.startsWith("/_next/static/") ? "public, max-age=31536000, immutable" : "no-cache",
    });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(target).pipe(res);
  })
  .listen(PORT, () => console.log(`Celina Bites on :${PORT}`));
