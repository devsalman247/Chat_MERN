import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

function Signup() {
  let navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [about, setAbout] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "username") {
      setName(value);
    }
    if (id === "email") {
      setEmail(value);
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "about") {
      setAbout(value);
    }
  };

  function showSuccess() {
    Swal.fire(
      'Signup successful!',
      `You're being redirected to login page`,
      'success'
    )
  }

  function showError() {
    Swal.fire({
      toast: true,
      icon: 'error',
      title: 'Signup failed..Try again!',
      animation: false,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
  }

  const handleSubmit = () => {
    if (!name) {
      return alert("Name cannot be empty");
    } else if (!email) {
      return alert("Email cannot be empty");
    } else if (!password) {
      return alert("Password cannot be empty");
    } else {
      axios
        .post("http://localhost:3000/api/user/signup", {
          name,
          email,
          password,
          about,
        })
        .then((res) => {
          if (res.status === 200) {
            showSuccess();
            return navigate("/login");
          } else {
            showError();
          }
        })
        .catch((err) => {
          showError();
          console.log(err);
        });
    }
  };

  return (
    <>
      <div className="w-1/3 m-auto h-94 mt-30 bg-sky-400 rounded p-4 text-xl">
        <div className="mb-2 text-center text-2xl">SIGNUP</div>
        <div className=" flex flex-col gap-4">
          <label htmlFor="username">Enter Name :</label>
          <input
            type="text"
            name="Name"
            id="username"
            className="rounded p-1.5 focus:outline-none"
            value={name}
            onChange={(e) => handleInputChange(e)}
          />
          <label htmlFor="email">Enter Email :</label>
          <input
            type="email"
            name="Email"
            id="email"
            className="rounded p-1.5 focus:outline-none"
            value={email}
            onChange={(e) => handleInputChange(e)}
          />
          <label htmlFor="password">Enter Password :</label>
          <input
            type="password"
            name="Password"
            id="password"
            className="rounded p-1.5 focus:outline-none"
            value={password}
            onChange={(e) => handleInputChange(e)}
          />
          <label htmlFor="about">Tell about yourself :</label>
          <input
            type="text"
            name="About"
            id="about"
            className="rounded p-1.5 focus:outline-none"
            value={about}
            onChange={(e) => handleInputChange(e)}
          />
          <button
            className="text-sky-800 bg-white mt-2 rounded p-2 focus:outline-none"
            type="submit"
            onClick={() => handleSubmit()}
          >
            SIGNUP
          </button>
        </div>
      </div>
    </>
  );
}

export default Signup;
