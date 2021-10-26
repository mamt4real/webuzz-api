const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const MyError = require("../utils/myError");
const jwt = require("jsonwebtoken");
const {promisify} = require("util");
//const sendEmail = require("../utils/email");
const crypto = require("crypto");
const Email = require('../utils/email');

const signToken = id => jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});

const createAndSendToken = (user, code, res) => {
    const token = signToken(user.id);

    res.cookie("jwt",token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    });
    user.password = undefined;
    res.status(code).json({status:"success",token,user});
}

exports.signin = catchAsync(async (req,res,next) => {
    const {email,password} = req.body;
    if(!email || !password){
        throw new MyError(`Please enter your ${!email?"email":"password"}!!`,400);
    }
    const user = await  User.findOne({email}).select("+password");
    if(!user){
        throw new MyError("Invalid email or password", 401);
    }
    const verified = await user.verifyPassword(password,user.password);
    if(!verified){
        throw new MyError("Invalid email or password", 401);
    }
    createAndSendToken(user,200,res);
});

exports.logout = (req,res)=>{
    res.cookie("jwt","Logged out", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({status:"success", message:"Logged out Successfully!"});
}

exports.signup =catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        confirmpass: req.body.confirmpass,
        email: req.body.email
    });
    const url = `${req.protocol}://${req.get('host')}/me`
    await new Email(newUser,url).sendWelcome();
    createAndSendToken(newUser,201,res);
});

exports.isLoggedIn = async (req,res,next) => {
    let token;
    if(req.cookies.jwt){
        token = req.cookies.jwt;
    }
    if(!token){
        return next();
    }
    let payload;
    try {
        payload = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    } catch (error) {
        return next();
    }    
    const user = await User.findById(payload.id);
    if(!user){
        return next()
    }

    if(user.changesPasswordAfter(payload.iat)){
        return next()
    }
    res.locals.user = user;
    next();
};

exports.protectRoute = catchAsync(async (req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }
    else if(req.cookies.jwt){
        token = req.cookies.jwt;
    }
    if(!token){
        throw new MyError("You are not logged in, please log in to get access", 401);
    }

    const payload = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    
    const user = await User.findById(payload.id);
    if(!user){
        throw new MyError("The user with this token no longer exists",401);
    }

    if(user.changesPasswordAfter(payload.iat)){
        throw new MyError("User recently changed password!! please log in again",401);
    }

    req.user = user;
    res.locals.user = user;
    next();
});

exports.restrictRouteTo = (...clearance) => {
    return (req, res, next) => {
        if(!clearance.includes(req.user.clearance)){
            throw new MyError("Ooops you are not cleared to perform this action",403);
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async (req,res,next) => {
    if(!req.body.email){
        throw new MyError("Please provide an email!!",404);
    }
    const user = await User.findOne({email:req.body.email});
    if(!user){
        throw new MyError("User does not exist!!",404);
    }
    const resetToken = user.getPasswordResetToken();
    await user.save({validateBeforeSave: false});
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetpassword/${resetToken}`;    
    try{
        await new Email(user,resetURL).sendPasswordReset();
        res.status(200).json({status:"success",message:"Token sent to your email success fully!!"});
    }catch(err){
        user.passwordResetToken = undefined;
        user.resetTokenExpiresAt = undefined;
        await user.save({validateBeforeSave: false});
        return  next(new MyError("There is an error sending the email, please try again later!",500));
    }
});

exports.resetPassword = catchAsync(async (req,res,next) => {

    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({passwordResetToken:hashedToken, resetTokenExpiresAt:{$gte:Date.now()}});

    if(!user){
        throw new MyError("Token is invalid or has expired!",400);
    }
    user.password = req.body.password;
    user.confirmpass = req.body.confirmpass;
    user.passwordResetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save();
    createAndSendToken(user,200,res);

});

exports.updatePassword = catchAsync( async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const oldPass = req.body.password;
    if(!(await user.verifyPassword(oldPass,user.password))){
        throw new MyError("Invalid password", 401);
    }
    user.password = req.body.newpassword;
    user.confirmpass = req.body.confirmpass;
    await user.save();
    createAndSendToken(user,200,res);

});