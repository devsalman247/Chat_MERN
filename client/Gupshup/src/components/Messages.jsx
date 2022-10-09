import { BiSend } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import moment from "moment";
import { useRef, useEffect } from "react";
import { useState } from "react";

function Messages({ messages, setMessages, id, chatId, setChatId, socket, loadMessages }) {
  const token = localStorage.getItem("chatToken");
  const ref = useRef();

  async function joinFriend() {
    await socket.emit("join", chatId);
  }

  async function sendMessage() {
    const msgInput = document.getElementById("msgInput");
    await axios
      .post(
        `http://localhost:3000/api/chat/start`,
        {
          id,
          message: msgInput.value,
        },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then((res) => {
        setChatId(res.data.data.chat.id);
        setMessages(res.data.data.chat.messages);
        socket.emit("send", { chatId, message: msgInput.value });
      })
      .catch((err) => console.log(err));
    msgInput.value = "";
  }

  function handleDelete(msgId) {
    axios
      .delete(`http://localhost:3000/api/chat/delete/${chatId}`, {
        data: { msgId },
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setMessages(res.data.data);
        }
      })
      .catch((err) => console.log(err));
  }

  function deleteChat() {
    axios
      .delete(`http://localhost:3000/api/chat/clear/${chatId}`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setMessages([]);
        }
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    const handler = async (data) => {
      if (data.chatId === chatId) {
        await loadMessages(id)
      }
    };
    socket.on("receive", handler);
    return () => socket.off("receive", handler);
  }, []);

  useEffect(() => {
    joinFriend(chatId);
    ref.current.scrollIntoView();
  }, [messages]);

  return (
    <div className="w-full max-w-[500px]">
      {messages.length === 0 ? (
        <></>
      ) : (
        <div className="w-full text-end">
          <button
            className="bg-sky-500 mt-1 mr-1 px-3 py-1 rounded text-white"
            onClick={deleteChat}
          >
            Clear chat
          </button>
        </div>
      )}
      <div className="h-4/5 mt-2 px-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-black text-xl h-full flex justify-center items-center">
            No messages to show!
          </div>
        ) : (
          messages.map((msg, key) => {
            return (
              <div
                key={key}
                className={`${
                  id !== msg.sentBy
                    ? "bg-white text-black text-right group py-3 px-3 my-2 ml-auto max-w-fit break-words rounded"
                    : "bg-sky-500 text-white group py-3 px-3 my-2 max-w-fit break-words rounded"
                }`}
              >
                {msg.body}
                <div className="text-xs flex items-center gap-2 justify-between">
                  <span className="ml-auto">
                    {moment(msg.sentAt).local().format("hh:mm")}
                  </span>
                  <button
                    className={`hidden group-hover:inline-block ${
                      id !== msg.sentBy ? "-order-2" : ""
                    }`}
                    onClick={() => handleDelete(msg._id)}
                  >
                    <RiDeleteBin6Line className="inline-block w-4 h-6" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        <div ref={ref}></div>
      </div>
      <input
        type="text"
        name="Message"
        id="msgInput"
        className="bg-white rounded-full border-2 border-slate-400 w-5/6 h-10 px-3 mt-4 mb-2 ml-4 focus:outline-none"
      />
      <button className="mb-2" onClick={() => sendMessage()}>
        <BiSend className="inline-block w-8 h-16 ml-2 text-sky-500" />
      </button>
    </div>
  );
}

export default Messages;
