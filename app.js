const express = require('express');
const path = require('path');
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const commentRouter = require('./routes/commentRoutes');
const MyError = require('./utils/myError');
const GlobalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require("cookie-parser");
const formidable = require("express-formidable")
//const bodyParser = require("body-parser");

const app = express();
//set up rendering services
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//supply static files
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
  max: 100,
  windowMs: 3600000,
  message: 'Too many request from this IP, please try again in an hour!!',
});

//global middlewares

//secured http headers
app.use(helmet());

//limit multiple request from single IP
app.use('/api', limiter);

//body parsers to req.body
 //app.use(formidable());

 //The two are not working for post request with FormaData containing files and fields
 app.use(express.urlencoded({ extended: true, limit: '10kb'}));
 app.use(express.json({ limit: '10kb' }));

// app.use((req,res,next) => {
//   req.body = req.fields;
//   next();
// });

app.use(cookieParser());

//clean injected query attacks
app.use(mongoSanitize());
//clean xss cross site scripting attack
app.use(xss());
//prevent http parameter pollution
app.use(hpp());

//route handlers
app.use('/',viewRouter);
app.use('/api/v1/posts/', postRouter);
app.use('/api/v1/comments/', commentRouter);
app.use('/api/v1/users/', userRouter);

//wild card handler for all routes that were not caught
app.all('*', (req, res, next) => {
  next(new MyError(`Can't find ${req.originalUrl} from this server`, 404));
});

//global error handling middleware
app.use(GlobalErrorHandler);

module.exports = app;
