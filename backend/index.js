const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
const PORT = 8080;

app.get('/api/home', (req, res) => {
  res.json({ message: 'HELLO WORLD!' });
});

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
