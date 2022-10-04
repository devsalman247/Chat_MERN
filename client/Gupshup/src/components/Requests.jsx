import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Requests() {
  const navigate = useNavigate();
  const token = localStorage.getItem("chatToken");
  const [userRequests, setUserRequests] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/friend/requests", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data.data) && res.data.data.length > 0) {
          setUserRequests(res.data.data);
        }
      })
      .catch((err) => {
        navigate("/login");
        alert("Session Expired...Please login again!!");
        console.log(err.message);
      });
  }, []);

  function acceptRequest(id, element) {
    axios.post(
        "http://localhost:3000/api/friend/new",
        { id },
        { headers: { Authorization: `Token ${token}` } }
      )
    .then(res => {
        if (res.status === 200) {
            const index = userRequests.findIndex(obj => obj.id===id);
            if(index>-1) {
                userRequests.splice(index, 1);
                setUserRequests([...userRequests]);
            }
            alert("Request accepted");
        }
    })
    .catch(err => console.log(err))
  }

  function cancelRequest(id) {
    axios.post(
        "http://localhost:3000/api/friend/cancel",
        { id },
        { headers: { Authorization: `Token ${token}` } }
      )
    .then(res => {
        if (res.status === 200) {
            const index = userRequests.findIndex(obj => obj.id===id);
            if(index>-1) {
                userRequests.splice(index, 1);
                setUserRequests([...userRequests]);
            }
            alert("Request has been cancelled");
          }
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="m-auto w-2/5 bg-gray-300 px-6 py-4">
      <h3 className="text-black text-xl">Pending requests :</h3>
      <div className="mt-3">
        {userRequests.length === 0
          ? "No pending requests found!!"
          : userRequests.map((obj, key) => {
              return (
                <div key={key}>
                  <div className="bg-slate-100 px-3 py-2 rounded-md text-start">
                    <h5>Name : {obj.name}</h5>
                    <h5>Email : {obj.email}</h5>
                    <h5>About : {obj.about}</h5>
                    <button
                      className="bg-sky-500 text-white px-3 py-1 mt-2"
                      onClick={(e) => acceptRequest(obj.id, e.target)}
                    >
                      Accept
                    </button>
                    <button
                        id="cancel"
                      className="bg-sky-500 text-white px-3 py-1 mt-2 ml-2"
                      onClick={(e) => cancelRequest(obj.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default Requests;
