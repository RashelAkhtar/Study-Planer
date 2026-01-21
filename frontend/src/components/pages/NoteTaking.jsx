import { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import "../styles/NoteTaking.css";

const emptyNote = { title: "", content: "" };

export default function NoteTaking() {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeNote, setActiveNote] = useState(emptyNote);
  const [mode, setMode] = useState("create"); // create | view | edit
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

  const selectNote = (note) => {
    setSelectedId(note.id);
    setActiveNote({ title: note.title, content: note.content });
    setMode("view");
    setError(null);
  };

  const startNewNote = () => {
    setSelectedId(null);
    setActiveNote(emptyNote);
    setMode("create");
    setError(null);
  };

  const startEdit = () => {
    setMode("edit");
    setError(null);
  };

  const cancelEdit = () => {
    if (mode === "edit" && selectedId) {
      const original = notes.find((n) => n.id === selectedId);
      if (original) {
        setActiveNote({ title: original.title, content: original.content });
        setMode("view");
      }
    } else {
      startNewNote();
    }
    setError(null);
  };

  const saveNote = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isValid(activeNote)) {
      setError("Note cannot be empty");
      return;
    }

    try {
      if (mode === "edit" && selectedId) {
        const { data } = await axios.put(`/api/notes/${selectedId}`, activeNote);
        const updated = data.note ?? { id: selectedId, ...activeNote };
        setNotes((prev) => prev.map((n) => (n.id === selectedId ? updated : n)));
        setActiveNote(updated);
        setMode("view");
      }

      if (mode === "create") {
        const { data } = await axios.post("/api/notes", activeNote);
        const newNote = data.note ?? data;
        setNotes((prev) => [newNote, ...prev]);
        setSelectedId(newNote.id);
        setActiveNote({ title: newNote.title, content: newNote.content });
        setMode("view");
      }
    } catch {
      setError("Failed to save note");
    }
  };

  const deleteNote = async () => {
    if (!selectedId) return;
    if (!window.confirm("Delete this note permanently?")) return;

    const backup = notes;
    setNotes((prev) => prev.filter((n) => n.id !== selectedId));

    try {
      await axios.delete(`/api/notes/${selectedId}`);
      startNewNote();
    } catch {
      setNotes(backup);
      setError("Delete failed");
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Notes</h2>
        <button className="new-note" onClick={startNewNote}>
          + New Note
        </button>

        {loading ? (
          <p className="status">Loading…</p>
        ) : (
          notes.map((n) => (
            <div
              key={n.id}
              className={`note-item ${selectedId === n.id ? "active" : ""}`}
              onClick={() => selectNote(n)}
            >
              <strong>{n.title || "Untitled"}</strong>
              <span>{new Date(n.created_at).toLocaleDateString()}</span>
            </div>
          ))
        )}
      </aside>

      <main className="editor">
        {mode === "view" && (
          <div className="viewer">
            <h1>{activeNote.title || "Untitled"}</h1>
            <p>{activeNote.content || "No content"}</p>

            <div className="actions">
              <button className="primary" onClick={startEdit}>Edit</button>
              <button className="danger" onClick={deleteNote}>Delete</button>
            </div>
          </div>
        )}

        {(mode === "edit" || mode === "create") && (
          <form className="editor-form" onSubmit={saveNote}>
            <input
              placeholder="Title"
              value={activeNote.title}
              onChange={(e) =>
                setActiveNote({ ...activeNote, title: e.target.value })
              }
            />
            <textarea
              placeholder="Write your note here…"
              value={activeNote.content}
              onChange={(e) =>
                setActiveNote({ ...activeNote, content: e.target.value })
              }
            />

            {error && <p className="error">{error}</p>}

            <div className="actions">
              <button type="submit" className="primary">
                {mode === "edit" ? "Update" : "Save"}
              </button>
              {mode === "edit" && (
                <button type="button" className="secondary" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
