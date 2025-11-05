const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoutes');
require('dotenv').config();

const app = express();
const PORT = 3003;

app.use(express.json());

app.use('/user', userRoutes);

// MongoDB Atlas connection
mongoose.connect('mongodb://mongo:27017/users')
  .then(() => console.log('Connected to Local MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('User Service is running');
})

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
