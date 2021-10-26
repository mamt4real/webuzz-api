const MyError = require('../utils/myError');

const sendDevError = (req, err, res) => {
  if (req.originalUrl.startsWith('/api'))
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err,
      stack: err.stack,
    });
  else
    res
      .status(err.statusCode)
      .render('error', { title: 'Something went wrong!!', msg: err.message });
};

const sendProdError = (req, err, res) => {
  if (err.isUserError)
    if (req.originalUrl.startsWith('/api'))
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    else
      res
        .status(err.statusCode)
        .render('error', { title: 'Something went wrong!!', msg: err.message });
  else {
    console.error('Error ', err);
    if (req.originalUrl.startsWith('/api'))
      res
        .status(500)
        .json({ status: 'error', message: 'Something went very wrong' });
    else
      res
        .status(err.statusCode)
        .render('error', {
          title: 'Something went wrong!!',
          msg: 'Please try again Later 👏👏👏',
        });
  }
};

const handleUniqueValidatorError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  return new MyError(
    `Duplicate field value. ${value} please use another value`,
    400
  );
};

const handleValidatorError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new MyError(`Invalid input data. ${errors.join('. ')}`, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(req, err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') {
      error = new MyError(
        `Invalid ${error.path} with value (${error.path})`,
        404
      );
    } else if (err.name === 'ValidationError') {
      error = handleValidatorError(error);
    } else if (err.name === 'JsonWebTokenError') {
      error = new MyError(`Invalid token, please log in again!!`, 401);
    } else if (err.name === 'TokenExpiredError') {
      error = new MyError(
        `Oops your token has expired, please log in again!!`,
        401
      );
    } else if (error.code === 11000) {
      error = handleUniqueValidatorError(error);
    }
    sendProdError(req, error, res);
  }
};
