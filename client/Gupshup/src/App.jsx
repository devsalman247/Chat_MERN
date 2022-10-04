import { Routes,Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import NoMatch from "./components/NoMatch";
import Nav from "./components/Nav";
import Search from "./components/Search";
import Requests from "./components/Requests";
import Chat from "./components/Chat";
import axios from "axios";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("chatToken");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchData = () => {
    return axios
      .get("http://localhost:3000/api/user/profile", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setIsLoggedIn(true);
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
    <div className="h-full">
      <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <Routes>
        <Route path="/" element={<Home setIsLoggedIn={setIsLoggedIn}/>}/>
        <Route path="chat" element={<Chat />}/>
        <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
        <Route path="signup" element={<Signup />}/>
        <Route path="search" element={<Search />}/>
        <Route path="requests" element={<Requests />}/>
        <Route path="*" element={<NoMatch />}/>
      </Routes>
    </div>
  );
}

export default App;
