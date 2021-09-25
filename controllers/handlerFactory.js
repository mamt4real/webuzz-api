const QueryHandler = require("../utils/queryHandler");
const catchAsync = require("../utils/catchAsync");
const MyError = require("../utils/myError");

exports.allowEdits = Model => catchAsync(async (req,res,next)=>{
    const id = Model.modelName.toLowerCase() + "ID";
    const doc = await Model.findById(req.params[id]);
    if((doc.authorID !== req.user.id) && !(req.user.clearance == "admin")){
        throw new MyError(`You can only ${req.method.toLowerCase()} ${Model.modelName.toLowerCase()} you created`,403);
    }
    next();
});

const confirmExistence = (doc , docName) => {
    if(!doc){
        throw new MyError(`No ${docName} found with that ID`,404);
    }
} 

exports.deleteOne = Model => catchAsync(async (req,res,next) => {
    const id = Model.modelName.toLowerCase() + "ID";
    const doc = await Model.findByIdAndDelete(req.params[id]);
    confirmExistence(doc,Model.modelName);

    res.status(204).json({status:"succcess", message:"Document deleted successfully"});    
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const id = Model.modelName.toLowerCase() + "ID";
    const doc = await Model.findByIdAndUpdate(req.params[id], req.body, {
        new:true,
        runValidators:true
    });
    confirmExistence(doc,Model.modelName);
    res.status(201).json({"success":true,"data":doc});
});


exports.getOne = (Model,populateOptions) => catchAsync(async (req,res,next) => {
    const id = Model.modelName.toLowerCase() + "ID";
    let query = Model.findById(req.params[id]);
    if(populateOptions) query = query.populate(populateOptions); 
    const doc = await query;
    confirmExistence(doc,Model.modelName);
    res.status(200).json({status:"succcess", "data":doc});
});

exports.getAll = (Model, filter={}) => catchAsync(async (req,res,next)=> {
    filter = req.params.postID?{postID:req.params.postID,parentID:{$exists:false}}:{};
    let processed = new QueryHandler(Model.find(filter),req.query,"claps -dateCreated").process();  
    const results = await processed;
    res.status(200).json({status:"success",result:results.length,data:results});
});

exports.createOne = Model => catchAsync(async (req,res,next) => {
    const newDoc= await Model.create(req.body);
    res.status(201).json({"success":true,"data":newDoc});
});