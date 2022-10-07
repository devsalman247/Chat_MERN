import { BiSend } from "react-icons/bi";
import axios from "axios";

function Messages({ messages, setMessages, id }) {
    console.log(messages);
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
      .then((res) => setMessages(res.data.data.chat.messages))
      .catch((err) => console.log(err));
  }

  return (
    <div className="w-full">
      <div className="h-5/6 mt-2 px-4 bg-blue-500 overflow-y-auto" id="chat">
        {messages?.length === 0
          ? ""
          : messages?.map((msg, key) => (
              <div
                key={key}
                className="bg-black text-white text-right py-1 px-2 my-2 ml-auto w-min"
              >
                {msg.body}
              </div>
            ))}
      </div>
      <input
        type="text"
        name="Message"
        id="msgInput"
        className="bg-white rounded-full w-5/6 h-10 px-3 mt-8 mb-2 ml-4 focus:outline-none"
      />
      <button className="mb-2" onClick={() => sendMessage()}>
        <BiSend className="inline-block w-8 h-16 ml-2 text-sky-500" />
      </button>
    </div>
  );
}

export default Messages;
