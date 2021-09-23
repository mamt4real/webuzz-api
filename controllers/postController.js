const catchAsync = require("../utils/catchAsync");
const MyError = require("../utils/myError");
const factory = require("./handlerFactory");

const User = require("../models/userModel");
const Post = require("../models/postModel");

exports.assignIDs = catchAsync(async (req,res,next)=>{
    if(!req.body.authorID)
        req.body.authorID = req.user.id;
    next();
});

exports.addToBookmarks = catchAsync(async (req, res, next) => {
    if(!req.user.bookmarks.includes(req.params.postID)){
        await User.updateOne(
            {_id:req.user.id},
            {$addToSet: {bookmarks: req.params.postID}});
    }
    res.status(200).json({status:"success", message:"Bookmarked Successfully!"});
});

exports.getBookmarks = catchAsync(async (req,res,next)=> {
    const bookmarks = await Post.find({"_id":{$in:req.user.bookmarks}}).select("title summary coverImg");
    res.status(200).json({status:"success", bookmarks});
});

exports.likePost = catchAsync( async (req, res, next)=>{

    let liked = await Post.updateOne(
        {_id:req.params.postID,claps:{$nin:[req.user.id]}},
        {$addToSet:{claps:req.user.id}}
    );
    if(liked.nModified == 0 && req.method == "DELETE"){
        liked = await Post.updateOne(
            {_id:req.params.postID,claps:{$in:req.user.id}},
            {$pull:{claps:req.user.id}}
        );
    }
    res.status(200).json({status:"success", message: `Like ${req.method.toLowerCase()}ed successfully`,liked});  
})

exports.getAll = factory.getAll(Post);
exports.getOne = factory.getOne(Post,{path:"comments"});
exports.deletePost = factory.deleteOne(Post);
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);

//Comments Controllers


exports.postStats = catchAsync(async (req, res,next) => {
    const stat = await Post.aggregate([
        {
            $match : {}
        },
        {
            $group: {
                _id: "$classID",
                noOfPosts: {$sum: 1}
            }
        },
        {
            $sort:{
                noOfPosts: -1,
                _id: 1
            }
        }

    ]);
    res.status(201).json({"success":true,"data":stat});
});