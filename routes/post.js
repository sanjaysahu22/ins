const mongoose = require('mongoose');
const plm= require('passport-local-mongoose');
const postSchema  = mongoose.Schema({
 postText:{
    type:String
 },
 postImg:{
    type:String
 },
 user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'user'
 },
 date:{
    type:Date,
    default:Date.now
 },
 likes:[{
    type:mongoose.Schema.Types.ObjectId
    , ref:'user'
 }]
})
mongoose.plugin(plm)
module.exports = mongoose.model('post' ,postSchema);