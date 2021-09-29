const {readFileSync} = require("fs");
const mongoose = require("mongoose");
const User = require("./userModel");
const Post = require("./postModel");
const dotenv = require("dotenv");


dotenv.config({path:"./config.env"});

mongoose.connect(process.env.DATABASE_VIRTUAL,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology: true
})
.then(() => console.log("Database Connection Successfull!"))
.catch(err=>console.log(err));


async function importFunc(){
    const users = JSON.parse(readFileSync(`${__dirname}/userSamples.json`));
    const posts = JSON.parse(readFileSync(`${__dirname}/postsSample.json`));
    try{
        //await User.create(users);
        await Post.create(posts);
        console.log("Data uploaded successfully!");
    }catch(err){
        console.log(err);
    }
}

async function deleteFunc(){
    try{
        await Post.deleteMany();
        //await User.deleteMany();
        console.log("Data deleted successfully");
    }catch(err){
        console.log(err);
    }
}

if(process.argv[2] === "--import"){
    importFunc();
}else if(process.argv[2] === "--delete"){
    deleteFunc();
}