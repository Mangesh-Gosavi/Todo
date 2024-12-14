import React, { useEffect, useState } from "react";
import light from './assets/brightness.svg'
import dark from './assets/moon.svg'
import Popup from './Popup';
import './App.css';

function App() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("high");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [darkmode, setDarkmode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/tasks");
        if (response.ok) {
          const data = await response.json();
          const sortedTasks = data.sort((a, b) => {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          });
          setTasks(sortedTasks);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [tasks]);

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  // Filter tasks based on the search query and task status (all, pending, complete)
  const filteredTasks = tasks.filter((task) => {
    const isTaskMatch = task.task.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'all') {
      return isTaskMatch;
    } else if (filter === 'pending') {
      return isTaskMatch && task.status !== 'complete';
    } else if (filter === 'completed') {
      return isTaskMatch && task.status === 'complete';
    }
    return isTaskMatch;
  });

  const handleAddTask = async () => {
    if (!task.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    setTask("");
    setPriority("high");

    try {
      const response = await fetch("http://localhost:5000/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task, priority }),
      });

      if (response.ok) {
        setShowPopup(true);
        setPopupMessage('Task Added!');
      } else {
        setShowPopup(true);
        setPopupMessage("Failed to save task");
      }
    } catch (error) {
      console.error("Error saving task:", error);
      setShowPopup(true);
      setPopupMessage("Error occurred while saving the task");
    }
  };

  const handleDelete = async (id) => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, status: "complete" } : task
      );
      setTasks(updatedTasks);

      const response = await fetch("http://localhost:5000/delete-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks: updatedTasks }),
      });

      if (response.ok) {
        setShowPopup(true);
        setPopupMessage("Task marked as complete!");
      } else {
        setShowPopup(true);
        setPopupMessage("Failed to mark task as complete");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      setShowPopup(true);
      setPopupMessage("Error occurred while updating the task status");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage('');
};

  return (
    <>
<div className={darkmode ? "bg-black text-white min-h-screen" : "bg-white text-black min-h-screen"}>
  <div className="flex bg-white text-black sticky top-0 items-center shadow-lg shadow-gray-400 w-full font-semibold h-16 sm:h-20 sm:text-lg xl:h-28 xl:text-2xl">
    <div className="flex gap-3 justify-between items-center w-full px-4 sm:px-8">
      <h1 className="text-blue-400 text-center sm:text-left mb-2 sm:mb-0">Todo List</h1>
      {!darkmode ? (
        <img className="w-6 h-6" src={dark} onClick={() => setDarkmode(true)} />
      ) : (
        <img className="w-6 h-6" src={light} onClick={() => setDarkmode(false)} />
      )}
    </div>
  </div>

  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-between p-4">
    <div className="flex gap-4 w-full">
      <input
        className="border text-black border-gray-400 rounded-md h-10 px-4 w-full"
        placeholder="Search the task"
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
      />
    </div>

    <select className="border text-black border-gray-400 rounded-md h-10 px-2 sm:w-auto w-full" value={priority} onChange={(e) => setPriority(e.target.value)}>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>

    <div className="flex gap-4 sm:w-3/5 lg:w-2/3">
      <input
        className="border text-black border-gray-400 rounded-md h-10 px-4 w-full"
        placeholder="Enter a task"
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500" onClick={handleAddTask}>
        Add
      </button>
    </div>
  </div>

  <div className="flex justify-between items-center p-4">
    <h1 className="text-lg sm:text-left mb-2 sm:mb-0">Your Tasks</h1>
    <div className="flex gap-4">
      <h1 className="cursor-pointer hover:scale-125 transition duration-1000" onClick={() => handleFilterChange('all')}>All</h1>
      <h1 className="cursor-pointer hover:scale-125 transition duration-1000" onClick={() => handleFilterChange('pending')}>Active</h1>
      <h1 className="cursor-pointer hover:scale-125 transition duration-1000" onClick={() => handleFilterChange('completed')}>Completed</h1>
    </div>
  </div>

  <div className="flex-grow pb-4"> 
    {filteredTasks.map((task) => (
      <div key={task.id} className="border-2 border-gray-500 p-4 m-2 rounded-lg w-full sm:w-4/5 lg:w-3/5 mx-auto sm:hover:scale-110 transition duration-1000">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{task.task}</h3>
          <div className="flex items-center gap-4">
            {task.status === "complete" ? (
              <h3 className="text-sm font-medium text-green-500">{task.priority}</h3>
            ) : (
              <h3 className="text-sm font-medium text-red-500">{task.priority}</h3>
            )}
            {task.status === "complete" ? (
              <h3 className="text-sm font-medium text-green-500">{task.status}</h3>
            ) : (
              <h3 className="text-sm font-medium text-red-500">{task.status}</h3>
            )}

            {task.status !== "complete" && (
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-500"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
  <div>{showPopup && <Popup message={popupMessage} onClose={closePopup} />}</div>
</div>


    </>
  );
}

export default App;
