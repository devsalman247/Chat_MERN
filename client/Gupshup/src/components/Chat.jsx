import { useState, useEffect } from "react";
import axios from "axios";

function Chat() {
  const [friends, setFriends] = useState([]);
  const token = localStorage.getItem("chatToken");

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
      <h2></h2>
      <div>
        {friends.length === 0
          ? `You've no friends yet! Make new to chat`
          : friends.map((user, key) => {
              return (
                <div key={key}>
                  Name : {user.name}
                  About : {user.about}
                </div>
              );
            })}
      </div>
    </>
  );
}

export default Chat;
