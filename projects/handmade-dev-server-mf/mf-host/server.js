const express = require('express');
const path = require('node:path');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(
  express.static(path.join(__dirname, 'dist'), {
    setHeaders: (res, path) => {
      res.setHeader('Cache-Control', 'max-age=31536000');
    },
  })
);
process.on('SIGINT', () => {
  console.log('Server is shutting down');
  process.exit(0);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
