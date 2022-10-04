import { Routes,Route } from "react-router-dom";
import { useState } from "react";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import NoMatch from "./components/NoMatch";
import Nav from "./components/Nav";
import Search from "./components/Search";
import Requests from "./components/Requests";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="h-full">
      <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <Routes>
        <Route path="/" element={<Home setIsLoggedIn={setIsLoggedIn}/>}/>
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
