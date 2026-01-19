import React, { useState } from "react";
import "../styles/NoteTaking.css";
import axios from "../../../api/axiosInstance";

function NoteTaking() {
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const handleInput = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noteData = { title: note.title, content: note.content };

    try {
      // using configured axios instance (baseURL from VITE_API)
      const response = await axios.post("/api/notes", noteData);

      if (response.status >= 200 && response.status < 300) {
        const result = response.data;
        console.log("Success: ", result);

        // Clear input field after submit
        setNote({ title: "", content: "" });
      } else {
        throw new Error(response.data?.message || "Failed to add note");
      }
    } catch (err) {
      // show server error if available
      console.error("Error: ", err.response?.data || err.message || err);
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
