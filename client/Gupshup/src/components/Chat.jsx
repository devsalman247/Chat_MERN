import { useState, useEffect, useRef } from "react";
import { FaUserAlt } from "react-icons/fa";
import {BiDotsVerticalRounded} from "react-icons/bi";
import Messages from "./Messages";
import axios from "axios";

function Chat() {
  const [user, setUser] = useState("");
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState("");
  const [currentUser, setCurrentUser] = useState('');
  const token = localStorage.getItem("chatToken");

  function loadMessages(id) {
    setCurrentUser(id);
    axios.get(`http://localhost:3000/api/chat/${id}`,{
      headers: { Authorization: `Token ${token}` },
    })
    .then((res) => {
      setChatId(res.data.data.id);
      setMessages(res.data.data.messages || [])
    })
    .catch((err) => console.log(err));
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/friend/all", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setFriends(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <h2 className="text-2xl text-center text-sky-500 font-medium mb-2">
        Let's Chat
      </h2>
      <div className="w-1/2 bg-slate-200 m-auto rounded h-4/5 border-2 flex">
        <div className="pt-1 pb-5 pl-2 w-1/3 h-full bg-white">
          {friends.length === 0
            ? `You've no friends yet! Make new to chat`
            : friends.map((user, key) => {
                return (
                  <button className="block w-full group" onClick={() => loadMessages(user.id)}>
                    <div className="flex items-center py-2 pl-2 mt-4 hover:bg-slate-200 rounded-l-md" >
                      <FaUserAlt className="w-10 h-8" />
                      <div key={key} className="text-sm ml-3 text-start">
                        <span className="text-lg">{user.name}</span> <br />
                        <span className="truncate">{user.about}</span>
                      </div>
                      <div className="ml-auto hidden group-hover:block">
                        <BiDotsVerticalRounded className="w-8 h-6"/>
                      </div>
                    </div>
                  </button>
                );
              })}
        </div>
        <Messages messages={messages} setMessages={setMessages} id={currentUser} chatId={chatId} setChatId={setChatId}/>
      </div>
    </>
  );
}

export default Chat;
