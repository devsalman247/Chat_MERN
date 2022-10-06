import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from "axios";

function Home({setIsLoggedIn}) {
  // const navigate = useNavigate();
  // const token = localStorage.getItem("chatToken");

  // function loginFailed() {
  //   Swal.fire({
  //     position: 'center',
  //     icon: 'error',
  //     title: "Login failed!",
  //     showConfirmButton: false,
  //     timer: 1500
  //   })
  // }

  // const fetchData = () => {
  //   return axios
  //     .get("http://localhost:3000/api/user/profile", {
  //       headers: { Authorization: `Token ${token}` },
  //     })
  //     .then((res) => {
  //       setIsLoggedIn(true);
  //     })
  //     .catch((error) => {
  //       navigate("login");
  //       loginFailed();
  //       console.log(error.message);
  //     });
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className="flex items-center flex-col h-full">
      
    </div>
  );
}

export default Home;
