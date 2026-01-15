import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.API_PORT;

app.use(cors());
app.use(express.json());

app.post("/api/login", async (req, res) => {
    const {mail, pass} = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1 AND password = $2",
            [mail, pass]
        );
        
        if (result.rows.length > 0) {
            res.status(200).json({message: "Login successful!"})
        } else {
            res.status(401).json({message: "Invalid credential"})
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).json({message: "Server error"})
    }
})

app.post("/api/register", async (req, res) => {
    const {user, mail, pass} = req.body;
    // console.log('Receved data: ', {user, mail, pass});

    // Data store
    try {
        const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
            [user, mail, pass]
        )
    } catch (error) {
        console.error("Error", err)
    }

    res.status(200).json({message: "Data received successfully!", data: req.body});
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
})