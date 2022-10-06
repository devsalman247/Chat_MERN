import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useRef } from "react";
import Swal from 'sweetalert2';

function Nav({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const login = useRef();
  const signup = useRef();

  function handleClick() {
    localStorage.removeItem("chatToken");
    Swal.fire('',`You've been logged out successfully!`,'success');
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
    login.current.classList.remove("hidden");
    signup.current.classList.remove("hidden");
  }

  return (
    <div className="bg-sky-500 w-full mb-10 h-10 py-6 flex justify-center items-center gap-10 text-xl">
      <Link to="/" className="text-white hover:text-gray-800">
        Home
      </Link>
      {!isLoggedIn && (
        <>
          <Link
            to="/signup"
            className="text-white hover:text-gray-800"
            id="signup"
            ref={signup}
          >
            Signup
          </Link>
          <Link
            to="/login"
            className="text-white hover:text-gray-800"
            id="login"
            ref={login}
          >
            Login
          </Link>
        </>
      )}
      {isLoggedIn && (
        <>
          <Link
            to="/chat"
            className="text-white hover:text-gray-800"
            id="chat"
          >
            Chat
          </Link>
          <Link
            to="/search"
            className="text-white hover:text-gray-800"
            id="search"
          >
            Search
          </Link>
          <Link
            to="/requests"
            className="text-white hover:text-gray-800"
            id="requests"
          >
            Requests
          </Link>
          <span
            className="text-white hover:text-gray-800 hover:cursor-pointer"
            onClick={() => handleClick()}
          >
            Logout
          </span>
        </>
      )}
    </div>
  );
}

export default Nav;
