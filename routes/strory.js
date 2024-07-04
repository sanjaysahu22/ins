const mongoose = require('mongoose');
const storySchema = mongoose.Schema({
    storyText:{
        type:String
    },
    likes:[{
        types:mongoose.Schema.Types.ObjectId,
        default:[]
    }]
})
modules.exports = mongoose.model('story',storySchema);
