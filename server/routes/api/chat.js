const router = require("express").Router(),
  auth = require("../auth"),
  checkMember = require("../../middlewares/isChatMember"),
  Chat = require("../../models/Chat");
const {
  OkResponse,
  BadRequestResponse
} = require("express-http-response");

router.use(auth.verifyToken);

router.get("/:id", checkMember, (req, res, next) => {
  const { chat } = req;
  next(new OkResponse(chat));
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
  Chat.findOne({ participants: [id, req.user.id] }, (err, foundChat) => {
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
        sentAt: Date.now(),
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

router.delete("/delete", checkMember, (req, res, next) => {
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
    chat.messages[index].deletedBy.push(req.user.id);
    if (chat.messages[index].deletedBy.length === chat.participants.length) {
      chat.messages.splice(index, 1);
    }
    chat.save((err, deletedChat) => {
      if (err) {
        next(new BadRequestResponse({ error: { message: err.message } }));
      } else {
        next(
          new OkResponse({
            success: true,
            message: "Message has been deleted successfully.",
          })
        );
      }
    });
  }
});

router.delete("/clear", checkMember, (req, res, next) => {
  const { chat } = req;
  chat.deletedBy.push(req.user.id);
  chat.messages.forEach((obj) => {
    if (!obj.deletedBy.includes(req.user.id)) {
      obj.deletedBy.push(req.user.id);
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
          } else {
            next(new OkResponse({ message: "chat deleted successfully" }));
          }
        });
      }
    }
  });
  chat.save((err) => {
    if (err) {
      next(
        new BadRequestResponse({
          message: "action can't be completed. Please try again!!",
        })
      );
    } else {
      next(new OkResponse({ message: "chat deleted successfully" }));
    }
  });
});

router.put("/update", checkMember, (req, res, next) => {
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

router.get("/search", checkMember, (req, res, next) => {
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
