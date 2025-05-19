require('dotenv').config();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credential: true,
  }),
);

app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`listening on https://localhost:${port}`);
});
