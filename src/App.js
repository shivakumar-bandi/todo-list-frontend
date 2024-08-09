import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

//const API_URL = 'http://localhost:5000/api/tasks';
const API_URL = 'https://todo-list-backend-34hm.onrender.com';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        console.log(response.data); // Log the response to check if it's an array
        const fetchedTasks = Array.isArray(response.data) ? response.data : [];
        setTasks(fetchedTasks);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTaskName) return;
  
    try {
      const response = await axios.post(API_URL, {
        name: newTaskName,
        completed: false
      });
      setTasks([...tasks, response.data]);
      setNewTaskName('');
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
  const handleDeleteTask = async (id) => {
    console.log(`Attempting to delete task with ID: ${id}`);
    try {
      await axios.delete(`${API_URL}/${id}`);
      console.log(`Task with ID ${id} deleted successfully`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  
  const handleToggleCompletion = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTasks(tasks.map(task => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleEditTask = async () => {
    if (!editTaskName) return;

    try {
      const response = await axios.put(`${API_URL}/${editTaskId}`, { name: editTaskName });
      setTasks(tasks.map(task => (task._id === editTaskId ? response.data : task)));
      setShowModal(false);
      setEditTaskName('');
      setEditTaskId(null);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const openEditModal = (task) => {
    setEditTaskId(task._id);
    setEditTaskName(task.name);
    setShowModal(true);
  };

  return (
    <div className="App">
      <header>
        <h1>To-Do List</h1>
      </header>

      <main>
        <div className="task-input-container">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Add a new task"
            className="task-input"
          />
          <button onClick={handleAddTask} className="task-button">Add Task</button>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="task-list">
            {tasks.map(task => (
              <li key={task._id} className={`task-item ${task.completed ? 'completed' : 'pending'}`}>
                <span
                  style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                  onClick={() => handleToggleCompletion(task._id, task.completed)}
                  className="task-name"
                >
                  {task.name}
                </span>
                <div>
                  <button
                    onClick={() => openEditModal(task)}
                    className="task-button edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="task-button delete-button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer>
        <p>&copy; 2024 My Todo App</p>
      </footer>

      {/* Modal for Editing Task */}
      {showModal && (
        <div className="overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Task</h2>
            </div>
            <div className="modal-body">
              <input
                type="text"
                value={editTaskName}
                onChange={(e) => setEditTaskName(e.target.value)}
                placeholder="Edit task name"
                className="task-input"
              />
            </div>
            <div className="modal-footer">
              <button onClick={handleEditTask} className="modal-button">Save</button>
              <button onClick={() => setShowModal(false)} className="modal-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
