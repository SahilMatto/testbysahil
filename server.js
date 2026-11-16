
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  let requestedPath = decodeURIComponent(
    new URL(req.url, 'http://localhost').pathname
  );

  if (requestedPath === '/') {
    requestedPath = '/index.html';
  }

  const filePath = path.resolve(root, '.' + requestedPath);

  if (!filePath.startsWith(root + path.sep)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      return res.end('File not found');
    }

    const contentType =
      mimeTypes[path.extname(filePath).toLowerCase()] ||
      'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType
    });

    res.end(content);
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Website running on port ${PORT}`);
});
