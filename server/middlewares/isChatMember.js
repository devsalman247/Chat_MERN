const Chat = require('../models/Chat');

module.exports = function(req, res, next) {
    const {id} = req.user;
    const {chatId} = req.body;
    if(!chatId) {
        res.send({error : {message : "Please provide chat id to proceed."}});
    }else {
        Chat.findById(chatId, (err, chat) => {
            if(err) {
                res.send({error : {message : err.message}});
            }else if(!chat) {
                res.send({error : {message : "Chat not found!"}});
            }else if(chat?.deletedBy?.includes(req.user.id)) {
                res.send({message : "No message "});
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