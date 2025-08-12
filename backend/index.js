const express = require('express');
const app = express();
const port = 3001; // Gunakan port selain 3000 agar tidak bentrok dengan frontend

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from eSIR 2.0 Backend!' });
});

app.listen(port, () => {
  console.log(`Server backend berjalan di http://localhost:${port}`);
});