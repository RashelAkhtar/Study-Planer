import { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import "../styles/NoteTaking.css";

const emptyNote = { title: "", content: "" };

export default function NoteTaking() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(emptyNote);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/notes");
      setNotes(data.notes ?? []);
    } catch {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const isValid = (note) => note.title.trim() || note.content.trim();

  const submitNote = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isValid(activeNote)) {
      setError("Note cannot be empty");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/notes/${editingId}`, activeNote);
        setNotes((prev) =>
          prev.map((n) => (n.id === editingId ? { ...n, ...activeNote } : n))
        );
      } else {
        const { data } = await axios.post("/api/notes", activeNote);
        setNotes((prev) => [data.note, ...prev]);
      }

      resetForm();
    } catch {
      setError("Failed to save note");
    }
  };

  const editNote = (note) => {
    setEditingId(note.id);
    setActiveNote({ title: note.title, content: note.content });
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this note permanently?")) return;

    const backup = notes;
    setNotes((prev) => prev.filter((n) => n.id !== id));

    try {
      await axios.delete(`/api/notes/${id}`);
    } catch {
      setNotes(backup);
      setError("Delete failed");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setActiveNote(emptyNote);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Notes</h2>
        <button className="new-note" onClick={resetForm}>+ New Note</button>

        {loading ? (
          <p className="status">Loading…</p>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="note-item" onClick={() => editNote(n)}>
              <strong>{n.title || "Untitled"}</strong>
              <span>{new Date(n.created_at).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </aside>

      <main className="editor">
        <form onSubmit={submitNote} className="editor-form">
          <input
            placeholder="Title"
            value={activeNote.title}
            onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
          />
          <textarea
            placeholder="Write your note here…"
            value={activeNote.content}
            onChange={(e) => setActiveNote({ ...activeNote, content: e.target.value })}
          />

          {error && <p className="error">{error}</p>}

          <div className="actions">
            <button type="submit" className="primary">
              {editingId ? "Update" : "Save"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="secondary">
                Cancel
              </button>
            )}
          </div>
        </form>

        {editingId && (
          <button className="delete" onClick={() => deleteNote(editingId)}>
            Delete Note
          </button>
        )}
      </main>
    </div>
  );
}