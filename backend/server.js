import express from "express";
import cors from "cors";
import pool from "./db.js";
import router from "./notes_db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.API_PORT;

const allowedOrigins = ["http://localhost:5173"]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  // Access-Control-Allow-Origin: allowedOrigins
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions));
app.use(express.json());

// mount notes routes
app.use("/api",router);

app.post("/api/login", async (req, res) => {
  const { mail, pass } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [mail, pass]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: "Login successful!" });
    } else {
      res.status(401).json({ message: "Invalid credential" });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/register", async (req, res) => {
  const { user, mail, pass } = req.body;
  if (!user || !mail || !pass) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [user, mail, pass]
    );
    return res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
