import { useState, useEffect } from "react"
import axios from "axios";

function Requests() {
    const [userRequests, setUserRequests] = useState([]);

    useEffect(() => {
        axios.post("http")
        .then()
        .catch()
    },[]);

  return (
    <div>Requests</div>
  )
}

export default Requests