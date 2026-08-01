// 零依赖静态文件服务器，支持 --port / --host 参数转发
const http = require("http");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
function argVal(names, dft) {
  for (let i = 0; i < args.length; i++) {
    for (const n of names) {
      if (args[i] === n && args[i + 1]) return args[i + 1];
      if (args[i].startsWith(n + "=")) return args[i].split("=")[1];
    }
  }
  return dft;
}
const port = parseInt(argVal(["--port", "-p"], "7100"), 10);
const host = argVal(["--host", "-H"], "0.0.0.0");
const root = __dirname;

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".md": "text/plain; charset=utf-8" };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join(root, path.normalize(p));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end("forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("not found"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, host, () => console.log(`Dev server: http://localhost:${port}/`));
