import "./App.css";
import Sun from "./images/icon-sun.svg";
import Moon from "./images/icon-moon.svg";
import { useEffect, useState } from "react";
import http from "./utils/http";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState({
    name: "",
    completed: false,
  });

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await http.get("/todos");
        console.log(response);
        setTodos(response.data.todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const addTodo = async () => {
    if (todo.name.trim() !== "") {
      try {
        const response = await http.post("/todos", {
          name: todo.name,
          completed: false,
        });
        console.log(response);
        setTodos([
          ...todos,
          response.data.todos[response.data.todos.length - 1],
        ]);
        setTodo({
          name: "",
          completed: false,
        });
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const handleComplete = async (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;

    try {
      await http.put(`/todos/${updatedTodos[index].id}`);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      await http.delete(`/todos/${todos[index].id}`);
      const updatedTodos = todos.filter((_, i) => i !== index);
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);
    try {
      await Promise.all(
        completedTodos.map((todo) => http.delete(`/todos/${todo.id}`))
      );
      const activeTodos = todos.filter((todo) => !todo.completed);
      setTodos(activeTodos);
    } catch (error) {
      console.error("Error clearing completed todos:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const itemsLeft = todos.filter((todo) => !todo.completed).length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <>
      <div className="w-[375px] xl:w-[1903px] xl:h-[2000px] flex relative bg-gray-100 dark:bg-[#181824]">
        {/* bg */}
        {darkMode ? (
          <div
            className={`bg-[url('./images/bg-mobile-dark.jpg')] xl:bg-[url('./images/bg-desktop-dark.jpg')] bg-cover w-[375px] h-[200px] xl:w-screen xl:h-[300px]`}
          ></div>
        ) : (
          <div
            className={`bg-[url('./images/bg-mobile-light.jpg')] xl:bg-[url('./images/bg-desktop-light.jpg')] bg-cover w-[375px] h-[200px] xl:w-screen xl:h-[300px]`}
          ></div>
        )}
        {/* main */}
        <div className="absolute top-0 w-full">
          {/* todo và button  */}
          <div className="flex justify-between text-white py-8 xl:py-12 xl:px-16">
            <div className="flex gap-4 font-semibold text-xl items-center">
              <p>T</p>
              <p>O</p>
              <p>D</p>
              <p>O</p>
            </div>
            {darkMode ? (
              <button type="button" onClick={() => setDarkMode(false)}>
                <img src={Moon} alt="Moon Icon" />
              </button>
            ) : (
              <button type="button" onClick={() => setDarkMode(true)}>
                <img src={Sun} alt="Sun Icon" />
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2 xl:px-20 xl:py-12">
            {/* create todo  */}
            <div className="flex w-full rounded items-center bg-white h-12 px-3 gap-3 dark:bg-[#25273c]">
              <div className="w-5 h-5 rounded-full bg-transparent border-solid border-[1px] border-gray-300 dark:border-[#4d5068]"></div>
              <input
                type="text"
                id="todo"
                placeholder="Create a new todo..."
                className="focus:outline-none bg-transparent text-blue-400 dark:text-blue-200 font-semibold xl:w-full"
                value={todo.name}
                onChange={(e) => setTodo({ ...todo, name: e.target.value })}
                onKeyPress={handleAddTodo}
              />
            </div>
            {/* todo list */}
            <div>
              <div className="flex flex-col w-full rounded bg-white dark:bg-[#24273d] items-center">
                {filteredTodos.map((todo, index) => (
                  <div
                    key={todo.id}
                    className="flex justify-between items-center h-12 gap-3 border-solid border-b-[1px] dark:border-[#4d5068] border-[#e9e8ed] w-full px-3"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={todo.completed}
                      onChange={() => handleComplete(index)}
                    />
                    <p
                      className={`${
                        todo.completed
                          ? "line-through text-[#4d5068]"
                          : "dark:text-blue-200 text-blue-400"
                      }`}
                    >
                      {todo.todo}
                    </p>
                    <button type="button" onClick={() => handleDelete(index)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#4d5068"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                <div className="flex justify-between w-full h-12 items-center px-3 text-gray-400 dark:text-[#4d5068] font-semibold">
                  <p>{itemsLeft} items left</p>
                  <button onClick={clearCompleted}>Clear Completed</button>
                </div>
              </div>
            </div>
            {/* luachon */}
            <div className="flex w-full justify-center items-center rounded bg-white dark:bg-[#24273d] h-12 px-3 gap-3 font-semibold text-gray-400 dark:text-[#4d5068]">
              <button
                className={`${filter === "all" ? "text-[#3C549A]" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`${filter === "active" ? "text-[#3C549A]" : ""}`}
                onClick={() => setFilter("active")}
              >
                Active
              </button>
              <button
                className={`${filter === "completed" ? "text-[#3C549A]" : ""}`}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
