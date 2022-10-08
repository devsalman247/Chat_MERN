import { BiSend } from "react-icons/bi";
import axios from "axios";
import moment from "moment";
import { useRef,useEffect } from "react";

function Messages({ messages, setMessages, id }) {
  const ref = useRef();
  function sendMessage() {
    const token = localStorage.getItem("chatToken");
    const msgInput = document.getElementById("msgInput");
    axios
      .post(
        `http://localhost:3000/api/chat/start`,
        {
          id,
          message: msgInput.value,
        },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then((res) => {
        console.log(res.data.data.chat.messages);
        setMessages(res.data.data.chat.messages);
      })
      .catch((err) => console.log(err));
    msgInput.value = "";
  }

  useEffect(() => {
    ref.current.scrollIntoView();
  }, [messages]);

  return (
    <div className="w-full max-w-[500px]">
      <div className="h-5/6 mt-2 px-4 overflow-y-auto">
        {messages.length === 0
          ? <div className="text-black text-xl h-full flex justify-center items-center">No messages to show!</div>
          : messages.map((msg, key) => (
              <div
                key={key}
                className="bg-white text-black text-right py-3 px-3 my-2 ml-auto max-w-fit break-words rounded"
              >
                {msg.body}
                <div className="text-xs">{moment(msg.sentAt).local().format('DD/MM/YY hh:mm')}</div>
              </div>
            ))}

        <div ref={ref}></div>
      </div>
      <input
        type="text"
        name="Message"
        id="msgInput"
        className="bg-white rounded-full border-2 border-slate-400 w-5/6 h-10 px-3 mt-8 mb-2 ml-4 focus:outline-none"
      />
      <button className="mb-2" onClick={() => sendMessage()}>
        <BiSend className="inline-block w-8 h-16 ml-2 text-sky-500" />
      </button>
    </div>
  );
}

export default Messages;
