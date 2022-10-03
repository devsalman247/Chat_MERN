import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Nav() {
    const navigate = useNavigate();

    function handleClick() {
        localStorage.removeItem("todoToken");
        navigate("/login", {replace : true});
    }

    return (
        <div className="bg-sky-500 w-full mb-10 h-10 py-6 flex justify-center items-center gap-10 text-xl">
            <Link to='/' className="text-white hover:text-gray-800">Home</Link>
            <Link to='/signup' className="text-white hover:text-gray-800">Signup</Link>
            <Link to='/login' className="text-white hover:text-gray-800">Login</Link>
            <span className="text-white hover:text-gray-800 hover:cursor-pointer" onClick={() => handleClick()}>Logout</span>
        </div>
    )
}

export default Nav;