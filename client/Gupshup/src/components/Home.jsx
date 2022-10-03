import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [todo, addTodo] = useState([]);
  const [text, setText] = useState("");
  const [updateId, setUpdateId] = useState("");
  const token = localStorage.getItem("todoToken");

  const fetchData = () => {
    return axios
      .get("http://localhost:3000/todo", {
        headers: { Authorization: `Token ${token}` }
      })
      .then((res) => addTodo([...res.data.todos]))
      .catch((error) => {
        navigate("login");
        alert("Session Expired...Please login again!!");
        console.log(error.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  function addTask() {
    const task = document.getElementById("todo_enter");
    if (!task.value) {
      return alert("Please enter some text to add todo");
    }
    axios
      .post(
        "http://localhost:3000/todo/add",
        { body: task.value },
        { headers: { Authorization: `Token ${token}` } }
      )
      .then((res) => {
        addTodo((todo) => [...todo, res.data.added]);
      })
      .catch((error) => console.log(error.message));
    setText("");
  }

  function deleteTask(id) {
    axios
      .delete("http://localhost:3000/todo/delete", {
        data: { id },
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) =>
        addTodo(todo.filter((todoItem) => todoItem.id !== res.data.deleted.id))
      )
      .catch((error) => console.log(error.message));
  }

  const updateBtn = document.getElementById("update_todo");
  const cancelBtn = document.getElementById("cancel_todo");

  function updateTask(id, body) {
    updateBtn.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
    setUpdateId(id);
    setText(body);
  }

  function updateTodo() {
    if (!text) {
      return alert("todo text cannot be empty");
    } else if (updateId) {
      axios
        .put(
          "http://localhost:3000/todo/update",
          {
            id: updateId,
            body: text,
          },
          { headers: { Authorization: `Token ${token}` } }
        )
        .then(() => fetchData())
        .catch((error) => console.log(error.message));
      setText("");
      updateBtn.classList.add("hidden");
      cancelBtn.classList.add("hidden");
    }
  }

  function cancelTodo() {
    updateBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    setText("");
    setUpdateId("");
  }
  return (
    <div className="flex items-center flex-col h-full">
      <Nav />
      <h2 className="font-medium text-2xl mb-2">My Todo List</h2>
      <div className="w-1/3">
        <input
          type="text"
          name="Todo_Task"
          id="todo_enter"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-slate-300 py-2 w-full rounded-md focus:outline-none px-2 mb-4"
        />
        <button
          id="add_todo"
          className="border-1 border-cyan-500 focus:outline-none"
          onClick={addTask}
        >
          Add Todo
        </button>
        <button
          id="update_todo"
          className="border-1 border-cyan-500 hidden ml-2 focus:outline-none"
          onClick={updateTodo}
        >
          Update
        </button>
        <button
          id="cancel_todo"
          className="border-1 border-cyan-500 hidden ml-2 focus:outline-none"
          onClick={cancelTodo}
        >
          Cancel
        </button>
      </div>
      <div className="mt-8 mb-4 bg-gray-300 h-full w-1/3 text-center py-3 rounded-lg">
        <div className="text-zinc-900 w-full h-full text-start">
          {todo.length !== 0 ? (
            todo.map((todoItem) => {
              return (
                <>
                  <div className="mb-2 rounded-sm bg-slate-50 p-1 mx-3 text-base overflow-hidden">
                    {todoItem.body}
                    <div>
                      <button
                        className="bg-sky-500 text-white rounded-sm py-1 px-2 m-2 focus:outline-none"
                        onClick={() => updateTask(todoItem.id, todoItem.body)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-sky-500 text-white rounded-sm p-1 m-2 focus:outline-none"
                        onClick={() => deleteTask(todoItem.id)}
                      >
                        Delete
                      </button>
                      <i className="fa-light fa-pen-to-square w-4"></i>{" "}
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <p className="ml-4">No Task added yet!!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
