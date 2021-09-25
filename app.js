const express = require("express");
const path = require("path");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");
const commentRouter = require("./routes/commentRoutes");
const MyError = require("./utils/myError");
const GlobalErrorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const app = express();
const limiter = rateLimit({
    max: 100,
    windowMs: 3600000,
    message: "Too many request from this IP, please try again in an hour!!"
});

//global middlewares

//secured http headers
app.use(helmet());

//limit multiple request from single IP
app.use("/api", limiter);

//supply static files
app.use(express.static("./public"));

//body parsers to req.body
app.use(express.urlencoded({extended:false}));
app.use(express.json({limit: "10kb"}));

//clean injected query attacks
app.use(mongoSanitize());
//clean xss cross site scripting attack
//app.use(xss());
//prevent http parameter pollution
app.use(hpp());

//route handlers
app.use("/api/v1/posts/",postRouter);
app.use("/api/v1/comments/",commentRouter);
app.use("/api/v1/users/",userRouter);

//wild card handler for all routes that were not caught 
app.all("*",(req,res, next)=>{
    next(new MyError(`Can't find ${req.originalUrl} from this server`,404));
});


//global error handling middleware
app.use(GlobalErrorHandler);

module.exports = app;