const mongoose = require("mongoose");

const Post = require("./postModel");

const commentSchema = mongoose.Schema({
    postID:{
        type:mongoose.Schema.ObjectId,
        ref: "Post",
        required:[true,"A comment must belong to a post!!!"]
    },
    parentID:{
        type:mongoose.Schema.ObjectId,
        ref: "Comment",
        default: null,
    },
    authorID:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"Please provide your ID to comment"]
    },
    content:{
        type:"String",
        maxlength:[600,"A comment cant be more than 600 characters!!"],
        required:[true,"A commment cannot be empty!!"]
    },
    claps:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],
    commentedAt:{
        type: Date,
        default: Date.now()
    },
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

commentSchema.virtual("replies",{
    ref:"Comment",
    localField:"_id",
    foreignField:"parentID"
});

const getComments = async function(postId){
    const comments = await Comment
    .aggregate([
        {
            $match:{postID:postId}
        },
        {
            $lookup:{
                from:"users",
                localField:"authorID",
                foreignField:"_id",
                as:"Member"
            }
        },
        {
            $group:{
                _id: "$parentID",
                replies: {$push:"$$ROOT"}
            }
        }
    ]);
    
    return comments;
};

commentSchema.pre(/^find/, function (next){
    this//.select("-__v")
    .populate("replies")
    .populate({
        path:"authorID",
        select:"username image"
    });
    next();
});

commentSchema.statics.commentStats = async function(post){
    const count = await this.find({postID:post,parentID: null}).countDocuments();
    await Post.findByIdAndUpdate(post,{noOfComments:count});
}

commentSchema.post("save", function(){
    this.constructor.commentStats(this.postID);
})

const Comment = mongoose.model("Comment", commentSchema);


module.exports = Comment;
