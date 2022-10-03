import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useRef } from "react";

function Nav() {
    const navigate = useNavigate();
    const login = useRef();
    const logout = useRef();
    const signup = useRef();

    function handleClick() {
        localStorage.removeItem("chatToken");
        alert("You've been logged out!!");
        navigate("/login", {replace : true});
        console.log(logout.current);
        logout.current.classList.add("hidden");
        login.current.classList.remove("hidden");
        signup.current.classList.remove("hidden");
    }

    return (
        <div className="bg-sky-500 w-full mb-10 h-10 py-6 flex justify-center items-center gap-10 text-xl">
            <Link to='/' className="text-white hover:text-gray-800">Home</Link>
            <Link to='/signup' className="text-white hover:text-gray-800" id="signup" ref={signup}>Signup</Link>
            <Link to='/login' className="text-white hover:text-gray-800" id="login" ref={login}>Login</Link>
            <span className="text-white hover:text-gray-800 hover:cursor-pointer" ref={logout} onClick={() => handleClick()}>Logout</span>
        </div>
    )
}

export default Nav;