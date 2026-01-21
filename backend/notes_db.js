import { Router } from "express";
import pool from "./db.js";

const router = Router();

// helper
const normalize = (value) =>
  typeof value === "string" ? value.trim() : "";

/**
 * CREATE NOTE
 * POST /api/notes
 */
router.post("/notes", async (req, res) => {
  const title = normalize(req.body.title);
  const content = normalize(req.body.content);

  if (!title && !content) {
    return res.status(400).json({
      message: "Note must have a title or content",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO notes (title, content)
       VALUES ($1, $2)
       RETURNING id, title, content, created_at`,
      [title, content],
    );

    return res.status(201).json({ note: result.rows[0] });
  } catch (err) {
    console.error("Create note error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET ALL NOTES
 * GET /api/notes
 */
router.get("/notes", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, content, created_at
       FROM notes
       ORDER BY created_at DESC`,
    );

    return res.status(200).json({ notes: result.rows });
  } catch (err) {
    console.error("Fetch notes error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET SINGLE NOTE
 * GET /api/notes/:id
 */
router.get("/notes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid note id" });
  }

  try {
    const result = await pool.query(
      `SELECT id, title, content, created_at
       FROM notes
       WHERE id = $1`,
      [id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ note: result.rows[0] });
  } catch (err) {
    console.error("Fetch note error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * UPDATE NOTE
 * PUT /api/notes/:id
 */
router.put("/notes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const title = normalize(req.body.title);
  const content = normalize(req.body.content);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid note id" });
  }

  if (!title && !content) {
    return res.status(400).json({
      message: "Note must have a title or content",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE notes
       SET title = $1, content = $2
       WHERE id = $3
       RETURNING id, title, content, created_at`,
      [title, content, id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ note: result.rows[0] });
  } catch (err) {
    console.error("Update note error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE NOTE
 * DELETE /api/notes/:id
 */
router.delete("/notes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid note id" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM notes WHERE id = $1`,
      [id],
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(204).end();
  } catch (err) {
    console.error("Delete note error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
