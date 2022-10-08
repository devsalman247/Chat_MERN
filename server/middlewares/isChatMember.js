const Chat = require('../models/Chat');
const { OkResponse, BadRequestResponse } = require("express-http-response");

module.exports = function(req, res, next) {
    const {id} = req.user;
    const {chatId} = req.params;
    if(!chatId) {
        next(new BadRequestResponse({error : {message : "Please provide chat id to proceed."}}));
    }else {
        Chat.findById(chatId, (err, chat) => {
            if(err || !chat) {
                next(new BadRequestResponse({error : {message : err.message}}));
            }else if(chat?.deletedBy?.includes(req.user.id)) {
                next(new OkResponse([]));
            }else {
                if(chat.participants.includes(id)) {
                    const filteredChat = chat; 
                    filteredChat.messages = chat.messages.filter(obj => !obj.deletedBy.includes(id));
                    req.chat = filteredChat;
                    next();
                }else {
                    res.send({error : {message : "You're not a member of chat!!"}});
                }
            }
        })
    }
}