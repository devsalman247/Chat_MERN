import { Routes,Route,Navigate } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import NoMatch from "./components/NoMatch";

function App() {
  return (
    <div className="h-full">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="login" element={<Login />}/>
        <Route path="signup" element={<Signup />}/>
        <Route path="*" element={<NoMatch />}/>
      </Routes>
    </div>
  );
}

export default App;
