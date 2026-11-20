const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'build');
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const requested = path.resolve(root, `.${pathname}`);
  const file = requested.startsWith(`${root}${path.sep}`) ? requested : path.join(root, 'index.html');

  fs.stat(file, (error, stats) => {
    const target = !error && stats.isFile() ? file : path.join(root, 'index.html');
    fs.readFile(target, (readError, content) => {
      if (readError) {
        res.writeHead(500);
        res.end('Unable to load application');
        return;
      }
      res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
      res.end(content);
    });
  });
}).listen(Number(process.env.PORT) || 8089, '0.0.0.0');
