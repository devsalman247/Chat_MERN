import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home({setIsLoggedIn}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("chatToken");

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
    <div className="flex items-center flex-col h-full">
      
    </div>
  );
}

export default Home;
