const express = require('express');
const net = require('net');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

function findFreePort(startPort) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => resolve(findFreePort(startPort + 1 )));
  });
}

findFreePort(8079).then(port => {
  app.listen(port, 'localhost', () => {
    console.log(`Server running at http://localhost:${8079}/`);
  
  
  });
});