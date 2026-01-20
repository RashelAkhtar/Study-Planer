import { Router } from "express";
import pool from "./db.js";

const router = Router();

// Create note (POST /api/notes)
router.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
      [title, content],
    );
    return res.status(201).json({ note: result.rows[0] });
  } catch (error) {
    console.error("Error inserting note:", error.stack || error);
    return res
      .status(500)
      .json({ message: "Server error", detail: error.message });
  }
});

// Get all notes (GET /api/notes)
router.get("/notes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes ORDER BY created_at DESC",
    );
    return res.status(200).json({ notes: result.rows });
  } catch (error) {
    console.error("Error fetching notes:", error.stack || error);
    return res
      .status(500)
      .json({ message: "Server error", detail: error.message });
  }
});

// Get single note (GET /api/notes/:id)
router.get("/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Note not found" });
    return res.status(200).json({ note: result.rows[0] });
  } catch (error) {
    console.error("Error fetching note:", error.stack || error);
    return res
      .status(500)
      .json({ message: "Server error", detail: error.message });
  }
});

// Update note (PUT /api/notes/:id)
router.put("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const result = await pool.query(
      "UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *",
      [title, content, id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Note not found" });
    return res.status(200).json({ note: result.rows[0] });
  } catch (error) {
    console.error("Error updating note:", error.stack || error);
    return res
      .status(500)
      .json({ message: "Server error", detail: error.message });
  }
});

// Delete note (DELETE /api/notes/:id)
router.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM notes WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Note not found" });
    return res.status(200).json({ note: result.rows[0] });
  } catch (error) {
    console.error("Error deleting note:", error.stack || error);
    return res
      .status(500)
      .json({ message: "Server error", detail: error.message });
  }
});

export default router;
