import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useRef } from "react";

function Nav({isLoggedIn,setIsLoggedIn}) {
    const navigate = useNavigate();
    const login = useRef();
    const signup = useRef();

    function handleClick() {
        localStorage.removeItem("chatToken");
        setIsLoggedIn(false);
        navigate("/login", {replace : true});
        login.current.classList.remove("hidden");
        signup.current.classList.remove("hidden");
        alert("You've been logged out!!");
    }

    return (
        <div className="bg-sky-500 w-full mb-10 h-10 py-6 flex justify-center items-center gap-10 text-xl">
            <Link to='/' className="text-white hover:text-gray-800">Home</Link>
            <Link to='/signup' className="text-white hover:text-gray-800" id="signup" ref={signup}>Signup</Link>
            <Link to='/login' className="text-white hover:text-gray-800" id="login" ref={login}>Login</Link>
            {isLoggedIn && <span className="text-white hover:text-gray-800 hover:cursor-pointer" onClick={() => handleClick()}>Logout</span>
}        </div>
    )
}

export default Nav;