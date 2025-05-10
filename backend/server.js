require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`listening on https://localhost:${port}`);
});
