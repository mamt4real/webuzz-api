const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({path:"./config.env"});

const app = require("./app");

//console.log(process.env);

mongoose.connect(process.env.DATABASE,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false,
    useUnifiedTopology: true
})
.then(() => console.log("Database Connection Successfull!"))
.catch(err=>console.log(err));



app.listen(process.env.PORT || 5000,()=>{
    console.log("Server listening at port 5000...")
});