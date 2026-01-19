import React, { useState } from "react";
import "../styles/NoteTaking.css"

function NoteTaking() {
  const API = import.meta.env.VITE_API;

  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const handleInput = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noteData = {title: note.title, content: note.content}

    try {
      const response = await fetch(`${API}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success: ", result);

        // Clear input field after submit
    setNote({title: "", content: ""})
      } else {
        const err = await response.json();
        throw new Error(err.message || "Failed")
      }
    } catch (err) {
      console.error("Error: ", err);
    }
    
  };

  return (
    <div className="note-container">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={note.title}
          name="title"
          className="note-title"
          onChange={handleInput}
          type="text"
          required
        />

        <textarea
          placeholder="Content"
          value={note.content}
          name="content"
          className="note-content"
          onChange={handleInput}
          required
        />

        <button type="submit">Add Note</button>
      </form>
    </div>
  );
}

export default NoteTaking;
