const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const MyError = require("../utils/myError");
const factory = require("./handlerFactory");

const filterBody = (body, ...valids) => {
    const filtered = {};
    Object.keys(body)
        .filter(key => valids.includes(key))
        .forEach(element => {
            filtered[element] = body[element]
        });
    return filtered;
}

exports.getMe = (req,res, next) => {
    req.params.userID = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
    if(req.body.password || req.body.confirmpass){
        throw new MyError("This is not for password updates, please use /updatepassword",400);
    }
    const filteredBody = filterBody(req.body,"name","email","image");
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new:true,
        runValidators:true
    });
    res.status(201).json({"success":true,"data":updatedUser});
});

exports.getFollowers = catchAsync(async (req, res, next) => {
    const followers = await User.findById(req.user.id)
        .populate("followers","username image")
        .populate("following", "username image")
        .select("followers following");
    res.status(200).json({status:"success",followers:followers.followers,following:followers.following});
});

const followUnfollow = async (req, res, followerUpdate, followingUpdate) =>{
    if(!req.body.userID){
        throw new MyError("Please supply user id to proceed",404);
    }
    const follower = await User.updateOne(
        {
            _id:req.user.id,
        },
        followerUpdate
    );
    const following = await User.updateOne(
        {
            _id:req.body.userID,
        },
        followingUpdate
    );
    if(!follower || !following){
        throw new MyError("Unable to follow/unfollow",401);
    }
    res.status(200).json({status:"success",message:"Operation Successful"});
}

exports.follow = catchAsync(async (req,res,next) =>{

    if(req.user.following.includes(req.body.userID)){
        throw new MyError("You are already following this member",401);
    }
    const followUpdate = {$addToSet: {following: req.body.userID}};
    const followingUpdate = {$addToSet:{followers:req.user.id}};
    await followUnfollow(req,res,followUpdate,followingUpdate);
});

exports.unFollow = catchAsync(async (req, res, next) =>{
    if(!req.user.following.includes(req.body.userID)){
        throw new MyError("You are already following this member",401);
    }
    const followUpdate = {$pull: {following:req.body.userID}};
    const followingUpdate =  {$pull: {following:req.user.id}};
    const user = await followUnfollow(req,res,followUpdate,followingUpdate);
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id,{active:false},{new:true});
    res.status(204).json({status:"success",data:null});
});

exports.getAllUsers = factory.getAll(User);
exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);