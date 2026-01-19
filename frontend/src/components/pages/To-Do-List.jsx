import { useState } from "react";
import "../styles/To-Do-List.css";

function ToDoList() {
  const [goal, setGoal] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  // Add a Task
  const addGoal = () => {
    if (newGoal.trim() !== "") {
      setGoal((prev) => [...prev, { id: Date.now(), text: newGoal }]);
      setNewGoal("");
    }
  };

  // Delete task
  const handleDelete = (id) => {
    const updateGoal = goal.filter((task) => task.id !== id); // the filter function returns all the id's(task) which is not equal to the selected id(task)
    setGoal(updateGoal);
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">To-Do List</h1>

      <div className="todo-input-section">
        <input
          className="todo-input"
          type="text"
          value={newGoal}
          onChange={(e) => {setNewGoal(e.target.value)}}
          placeholder="Set todays goal..."
          onKeyDown={(e) => {
            e.key === "Enter" && addGoal();
          }}
        />
        <button className="todo-add-btn" onClick={addGoal}>
          Add
        </button>
      </div>

      <div className="todo-dispaly-section">
        <ul className="todo-list">
          {goal.map((task) => (
            <li className="todo-item" key={task.id}>
              <span className="todo-text">• {task.text}</span>
              <button
                className="todo-delete-btn"
                onClick={() => handleDelete(task.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ToDoList;
