const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
dotenv.config();

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => console.log('MongoDB Connection Success!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Import and use the student routes
const studentRoute = require('./routes/students_route');
app.use('/student', studentRoute);

app.listen(PORT, () => {
  console.log(`Server is up and running on port : ${PORT}`);
});
