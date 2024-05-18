require('dotenv').config();
require('express-async-errors');

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const xss = require('xss-clean');
const cloudinary = require('cloudinary').v2;

const corsSetup = require('./middleware/cors');
const rateLimiterSetup = require('./middleware/rateLimiter');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const reportRouter = require('./routes/reportRoutes');
const commonRouter = require('./routes/commonRoutes');
const analyticsRouter = require('./routes/analyticsRoutes');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(corsSetup);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(morgan('tiny'));
// app.use(rateLimiterSetup);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/report', reportRouter);
app.use('/api/v1/common', commonRouter);
app.use('/api/v1/analytics', analyticsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (err) {
    console.log(`Server could not start with error: ${err.message}`);
  }
};

start();
