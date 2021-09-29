const mongoose = require("mongoose");
//const Comment = require("./commentModel");
const User = require("./userModel");

const postSchema = mongoose.Schema({
    authorID:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required: [true,"Please provide the author ID"]
    },
    title:{
        type:String,
        maxlength:[100,"Title shouldnt be more than 60 characters"],
        required:[true,"Please provide a title for the post"],
        unique:[true,"Title already exists, please re-caption your post!"],
        minlength:[15,"A title should be atleast 15 characters"]
    },
    summary:{
        type:String,
        maxlength:[250,"Summary shouldnt be more than 250 characters"],
        required:[true,"Please provide a title for the post"]
    },
    tags:{
        type:[String],
        validate:{
            validator: function(val){
                return val.length >= 1;
            },
            message: "Please provide the main topic of your post!"
        }
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

postSchema.statics.incrementAuthorPosts = async function(author){
    await User.findByIdAndUpdate(
        author,
        {
            $inc:{noOfPosts:1}
        }
    );
}

postSchema.pre("save", function(next){
    if(this.isNew)
        this.constructor.incrementAuthorPosts(this.authorID);
    next();
})
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