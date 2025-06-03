require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
// NOTE: imports user-relateed route (login, register and protected dashboard route)
const userRoutes = require('./routes/userRoutes');
const express = require('express');

connectDB(); // Connect to MongoDB

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

// NOTE: mount user authenticated route under /api/users
app.use('/api/users', userRoutes);

// TODO: Connect to MONGODB to store persisted user data

app.listen(port, () => {
  console.log(`listening on https://localhost:${port}`);
});
