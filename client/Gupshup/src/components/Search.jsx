import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

function Search() {
  const [searchList, setSearchList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const token = localStorage.getItem("chatToken");

  function fetchUsers(name) {
    let searchString = "";
    if (!name) {
      searchString += "a";
    } else {
      searchString = name;
      axios
        .post(
          "http://localhost:3000/api/user/search",
          { name: searchString },
          { headers: { Authorization: `Token ${token}` } }
        )
        .then((userList) => {
          setSearchList(userList.data);
        })
        .catch((err) => console.log(err));
    }
  }

  function handleChange(value) {
    setInputValue(value);
    fetchUsers(value);
  }

  function showSuccess() {
    Swal.fire({
      toast: true,
      icon: 'success',
      title: 'Request has been sent',
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

  function sendRequest(userId, btn) {
    if (userId) {
      axios
        .post(
          "http://localhost:3000/api/friend/add",
          { id: userId },
          { headers: { Authorization: `Token ${token}` } }
        )
        .then((res) => {
          if (res.status === 200) {
            btn.classList.remove("bg-sky-500", "text-white");
            btn.classList.add("bg-gray-500", "text-white", "hover:cursor-not-allowed");
            btn.textContent = "Request sent";
            btn.disabled = true;
            showSuccess();
          }
        })
        .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex items-center flex-col h-full">
      <div className="bg-sky-500 px-5 py-2 rounded-full text-xl">
        <label htmlFor="search" className="text-white">
          Find new friends for chat :
        </label>
        <input
          type="text"
          name="Search"
          id="search"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          className="focus:outline-none ml-2 py-1 px-2 rounded-2xl"
        />
      </div>
      <div className="mt-8 mb-4 bg-gray-300 h-full w-2/5 text-center py-5 px-6 rounded-lg">
        {searchList.length === 0
          ? "No results found"
          : searchList.map((obj, key) => {
              return (
                <div className="mb-5" key={key}>
                  <div className="bg-slate-100 px-3 py-2 rounded-md text-start">
                    <h5>Name : {obj.name}</h5>
                    <h5>Email : {obj.email}</h5>
                    <h5>About : {obj.about}</h5>
                    <button
                      className="bg-sky-500 text-white px-3 py-1 mt-2"
                      onClick={(e) => sendRequest(obj.id,e.target)}
                    >
                      Add Friend
                    </button>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default Search;
