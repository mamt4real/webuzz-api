const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide a name"]
    },
    image:{
        type:String
    },
    username:{
        type:String,
        required:[true,"please provide a username"],
        unique:[true,"username already exist"]
    },
    email:{
        type:String,
        required:[true,"please provide an email"],
        unique:[true,"email already exist"],
        validate:[validator.isEmail,"please provide a valid email address"]
    },
    password:{
        type:String,
        required:[true,"please enter your password"],
        minLength: [8,"a password sould be atleast 8 characters"],
        select: false
    },
    about:{
        type:String,
        maxLength:[150,"about shouldnt be more than 150 characters"]
    },
    confirmpass:{
        type:String,
        required: [true,"Please confirm your password"],
        validate:{
            validator: function(val){
                return this.password === val;
            },
            message:"Password Mismatch"
        }
    },
    clearance:{
        type:String,
        enum:{
            values:["admin","member"],
            message:"clearance should be one of admin/client"
        },
        default:"member"
    },
    passwordChangedAt:{
        type:Date,
        select:false
    },
    passwordResetToken: String,
    resetTokenExpiresAt: Date,
    active:{
        type: Boolean,
        default: true,
        select: false
    },
    followers:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],
    following:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],
    bookmarks:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Post"
        }
    ]
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmpass = undefined;
    next();
});

userSchema.pre("save", function(next){
    if(!this.isModified("password") || this.isNew){
        return next();
    }
    this.passwordChangedAt = Date.now() - 1000;
    next()
});

userSchema.pre(/^find/,function(next){
    this.find({active:{$ne: false}});
    next();
});

userSchema.virtual("noOfFollowers").get(function(){
    if(this.followers)
        return this.followers.length;
    return 0
});

userSchema.virtual("noOfFollowing").get(function(){
    if(this.following)
        return this.following.length;
    return 0;
});

userSchema.virtual("noOfPosts").get(function(){
    return 0;
});

userSchema.methods.verifyPassword = function(candidatePassword, userPassword){
    return bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changesPasswordAfter = function(tokenTimeStamp){
    if(this.passwordChangedAt){
        const lastPassChangedAt = parseInt(this.passwordChangedAt.getTime()/1000);
        return tokenTimeStamp < lastPassChangedAt;
    }
    return false;
}

userSchema.methods.getPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    
    //token expires after 15 minutes
    this.resetTokenExpiresAt = Date.now() + 15*60*1000;
    return resetToken;
}

const User = mongoose.model("User",userSchema);

module.exports = User;