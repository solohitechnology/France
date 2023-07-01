require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoute = require('./route/auth');
const blogpostRoute = require('./route/blog');
const paymentRoute = require('./route/payment');
const question = require('./route/quessionnier');
const serminarRoute = require('./route/serminar');
const certificate = require('./route/certificate');
const videoUpload = require('./route/upload_Video');
const uploadbookRoutes = require('./route/uploadBooks');
const Testimonial = require('./route/testimonial');

const myMiddleware = (req, res, next) => {
  next();
};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

const app = express();
app.use(myMiddleware);

// Serve static files from the 'build' directory inside the server directory
app.use(express.static(path.join(__dirname, 'build')));

// Serve files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth/', authRoute);
app.use('/api/cert', certificate);
app.use('/api/video', videoUpload);
app.use('/api/testimo', Testimonial);
app.use('/api/blog', blogpostRoute);
app.use('/api/paystack', paymentRoute);
app.use('/api/seminar', serminarRoute);
app.use('/api/books', uploadbookRoutes);

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = 4000;
app.listen(port, () => {
  console.log('Server is listening on port ' + port);
});
