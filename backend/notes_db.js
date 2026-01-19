import {Router} from "express";
import pool from "./db.js";

const router = Router();

router.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );
    return res.status(201).json({ message: "Note created", note: result.rows[0] });
  } catch (error) {
    console.error("Error inserting note", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
