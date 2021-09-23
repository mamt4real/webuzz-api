const mongoose = require("mongoose");
//const Comment = require("./commentModel");


const postSchema = mongoose.Schema({
    authorID:{
        type:String,
        required: [true,"Please provide the author ID"]
    },
    title:{
        type:String,
        maxlength:[60,"Title shouldnt be more than 60 characters"],
        required:[true,"Please provide a title for the post"],
        unique:[true,"Title already exists, please re-caption your post!"],
        minlength:[15,"A title should be atleast 15 characters"]
    },
    summary:{
        type:String,
        maxlength:[150,"Title shouldnt be more than 150 characters"],
        required:[true,"Please provide a title for the post"]
    },
    tags:{
        type:[String]
    },
    coverImg:{
        type:String,
        required:[true,"Please provide a cover Image for your post"]
    },
    dateCreated:{
        type:Date,
        default: Date.now()
    },
    content:{
        type:String
    },
    published:{
        type:Boolean,
        default: false
    },
    noOfComments:{
        type:Number,
        default:0
    },
    claps:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }]

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

/* postSchema.virtual("noOfComments").get(function(){
    return this.comments.length;
});
 */
postSchema.virtual("comments",{
    ref:"Comment",
    foreignField:"postID",
    localField: "_id"
});

postSchema.virtual("noOfClaps").get(function(){
    if(this.claps)
        return this.claps.length;
    return 0;
})

//single index
//postSchema.index({dateCreated:1});

//compound index
//postSchema.index({claps:1,tags:1});

const Post = mongoose.model("Post",postSchema);
module.exports = Post;