import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("chatToken");
  const [res, setRes] = useState("");

  const fetchData = () => {
    const loginEl = document.getElementById("login");
    const signupEl = document.getElementById("signup");
    loginEl.classList.add("hidden");
    signupEl.classList.add("hidden");
    
    return axios
      .get("http://localhost:3000/api/user/profile", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setRes(res.data.name);
      })
      .catch((error) => {
        navigate("login");
        alert("Session Expired...Please login again!!");
        console.log(error.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex items-center flex-col h-full">
      <h2>{res}</h2>
    </div>
  );
}

export default Home;
