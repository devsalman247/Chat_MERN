const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema(
    {
        name : {
            type     : String,
            required : [true, 'is required']
        },
        description : {
            type     : String,
            required : true
        },
        admins : [{
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'User' 
        }],
        members : [{
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'User'
        }], 
        limit : {
            type    : Number,
            default : 200,
            immutable : true
        },
        createdAt : {
            type    : Date,
            default : Date.now()
        },
        createdBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'User'
        }, 
        canSendMsg : {
            type    : Boolean,  // false= only admin can send, true= all participants can send
            default : true
        },
        chat : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Chat'
        }
    },
    {timestamps : true}
);

module.exports = mongoose.model('Group', GroupSchema);