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

exports.setDefaultFilter = (req,res,next) =>{
    const filter = {published:true};
    req.filter = filter;
    next();
}

exports.publishPost = catchAsync(async (req,res,next)=> {
    await Post.updateOne({_id:req.params.postID},{published:true});
    res.status(200).json({status:"success",message:"Post published successfully"});
});

exports.addToBookmarks = catchAsync(async (req, res, next) => {
    if(!req.user.bookmarks.includes(req.params.postID)){
        await User.updateOne(
            {_id:req.user.id},
            {$addToSet: {bookmarks: req.params.postID}});
    }else{
        if(req.method == "DELETE"){
            await User.updateOne(
                {_id:req.user.id},
                {$pull:{bookmarks:req.params.postID}}
            );
        }
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
});

exports.allowEdits = factory.allowEdits(Post);
exports.getAll = factory.getAll(Post);
exports.getOne = factory.getOne(Post,
    [
        ["authorID","username image"],
        ["comments","content authorID"]
    ]);
exports.deletePost = factory.deleteOne(Post);
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);