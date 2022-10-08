const router = require("express").Router(),
  auth = require("../auth"),
  checkMember = require("../../middlewares/isChatMember"),
  Chat = require("../../models/Chat");
const { OkResponse, BadRequestResponse } = require("express-http-response");

router.use(auth.verifyToken);

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    next(new BadRequestResponse("Provide user id"));
  }
  Chat.findOne({ participants: { $all: [id, req.user.id] } }, (err, chat) => {
    if (err) {
      next(new BadRequestResponse(err.message));
    } else if (!chat) {
      next(new OkResponse([]));
    } else if (chat) {
      if (chat?.deletedBy?.includes(req.user.id)) {
        next(new OkResponse([]));
      }
      next(new OkResponse(chat));
    }
  });
});

router.post("/start", (req, res, next) => {
  const { id, message } = req.body;
  if (!id || !message) {
    next(
      new BadRequestResponse({
        error: { message: "Please provide id and message to start chat" },
      })
    );
  }
  Chat.findOne({ participants: { $all: [id, req.user.id] } }, (err, foundChat) => {
    if (err) {
      next(new BadRequestResponse({ error: { message: err.message } }));
    } else if (!foundChat) {
      const chat = new Chat();
      chat.category = 1;
      chat.participants.push(id, req.user.id);
      chat.messages.push({
        body: message,
        sentBy: req.user.id,
        sentAt: Date.now(),
      });
      chat.save((error, savedChat) => {
        if (error) {
          next(new BadRequestResponse({ error: { message: err.message } }));
        } else {
          next(new OkResponse({ success: true, chat: savedChat }));
        }
      });
    } else {
      foundChat.messages.push({
        body: message,
        sentBy: req.user.id,
        sentAt: new Date(),
      });
      const deletedChatFor = foundChat.deletedBy.indexOf(req.user.id);
      if (deletedChatFor > -1) {
        foundChat.deletedBy.splice(deletedChatFor, 1);
      }
      foundChat.save((error, savedChat) => {
        if (error) {
          next(new BadRequestResponse({ error: { message: err.message } }));
        } else {
          next(new OkResponse({ success: true, chat: savedChat }));
        }
      });
    }
  });
});

router.delete("/delete/:chatId", checkMember, (req, res, next) => {
  const { msgId } = req.body;
  if (!msgId) {
    next(
      new BadRequestResponse({
        error: { message: "Please provide message id." },
      })
    );
  }
  const { chat } = req;
  const index = chat.messages.findIndex(
    (obj) => obj.id === msgId && !obj.deletedBy.includes(req.user.id)
  );
  if (index === -1) {
    next(
      new BadRequestResponse({ error: { message: "Message is not present." } })
    );
  } else {
    Chat.findById(chat._id, (err, chatToUpdate) => {
      if(err || !chatToUpdate) {
        next(new BadRequestResponse("Something went wrong"));
      }
        chatToUpdate.messages[index].deletedBy.push(req.user.id);
        if (chatToUpdate.messages[index].deletedBy.length === chatToUpdate.participants.length) {
          chatToUpdate.messages.splice(index, 1);
        }
        chatToUpdate.save((err, deletedChat) => {
          if (err || !deletedChat) {
            next(new BadRequestResponse({ error: { message: err.message } }));
          } else {
            const filteredChat = deletedChat.messages.filter(msg => !msg.deletedBy.includes(req.user.id))
            next(
              new OkResponse(filteredChat)
            );
          }
        });
      
    })
  }
});

router.delete("/clear/:chatId", checkMember, (req, res, next) => {
  const { chat } = req;
  chat.deletedBy.push(req.user.id);
  if (chat.deletedBy.length === chat.participants.length) {
    Chat.findByIdAndDelete(chat.id, (err, deleted) => {
      if (err) {
        next(
          new BadRequestResponse({
            error: {
              message: "Chat couldn't be deleted. Please try again!!",
            },
          })
        );
      } else if(deleted) {
        next(new OkResponse({ message: "chat deleted successfully" }));
      }else if(!deleted) {
        next(new BadRequestResponse('sorry'));
      }
    });
  }else {
    Chat.findById(chat.id, (err, chatToUpdate) => {
      if(err) {
        next(
          new BadRequestResponse({
            error: {
              message: "Chat couldn't be deleted. Please try again!!",
            },
          })
        );
      }else if(!chatToUpdate) {
        next(
          new BadRequestResponse('Something went wrong')
        );
      }else {
        chatToUpdate.deletedBy.push(req.user.id);
        chatToUpdate.messages.forEach((obj) => {
          if (!obj.deletedBy.includes(req.user.id)) {
            obj.deletedBy.push(req.user.id);
          }
        });
        chatToUpdate.save((err, success) => {
          if(err) {
            next(new BadRequestResponse('something wrong'));
          }else {
            next(new OkResponse(success));
          }
        })
      }
    })
  }
});

router.put("/update/:chatId", checkMember, (req, res, next) => {
  const { msgId, message } = req.body;
  if ((!msgId, !message)) {
    next(
      new BadRequestResponse({
        error: { message: "Please provide message id and message to update." },
      })
    );
  }
  let { chat } = req;
  const index = chat.messages.findIndex(
    (obj) => obj.id === msgId && !obj.deletedBy.includes(req.user.id)
  );
  if (index === -1) {
    next(
      new BadRequestResponse({ error: { message: "Message is not present." } })
    );
  } else {
    chat.messages[index].body = message;
    chat.messages[index].isEdited = true;
    chat.messages[index].editedBy = req.user.id;
    chat.save((err, updatedChat) => {
      if (err) {
        next(new BadRequestResponse({ error: { message: err.message } }));
      } else {
        next(
          new OkResponse({
            success: true,
            more: {
              message: "Message has been updated successfully.",
              data: updatedChat,
            },
          })
        );
      }
    });
  }
});

router.get("/search/:chatId", checkMember, (req, res, next) => {
  const { chat } = req;
  const { message } = req.body;
  const filteredChat = chat.messages.filter(
    (obj) => obj.body.toLowerCase().indexOf(message) > -1
  );
  if (filteredChat) {
    next(new OkResponse(filteredChat));
  } else {
    next(new BadRequestResponse({ error: { message: "no messages found" } }));
  }
});

module.exports = router;
