import { useState,useEffect } from "react"
import axios from 'axios';

function Chat() {
  const token = localStorage.getItem("chatToken");
  useEffect(() => {
    axios.get("http://localhost:3000/api/friend/all", {
      headers: { Authorization: `Token ${token}` },
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
  },[]);
    // const 
  return (
    <div>Chat</div>
  )
}

export default Chat