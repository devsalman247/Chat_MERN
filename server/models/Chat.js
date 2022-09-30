const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
    {
        participants : [{
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'User'
        }],
        category : {
            type     : Number ,  // 0 = group, 1 = one-to-one 2 = unknown-to-unknown
            required : true
        },
        messages : [{
            body : {
                type     : String,
                required : true
            },
            sentBy : {
                type : mongoose.Schema.Types.ObjectId,
                ref  : 'User'
            },
            sentAt   : {
                type     : Date,
                required : true
            },
            isEdited : {
                type    : Boolean,
                default : false
            },
            editedBy : {
                type : mongoose.Schema.Types.ObjectId,
                ref  : 'User'
            },
            deletedBy : [{
                type : mongoose.Schema.Types.ObjectId,
                ref  : 'User'
            }]
        }],
        deletedBy : [{
            type  : mongoose.Schema.Types.ObjectId,
            default : []
        }]
    },
    {timestamps : true}
);

ChatSchema.methods.toJSON = function () {
    return {
        id : this.id,
        participants : this.participants,
        category : this.category,
        messages : this.messages
    }
}

module.exports = mongoose.model('Chat', ChatSchema);