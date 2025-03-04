require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const app = express();

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.set("view engine", "ejs");  // Set EJS as the templating engine
app.set("views", __dirname + "/views"); // Ensure Express looks in the correct folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos");
    res.render("index", { todos: result.rows });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/add", async (req, res) => {
  try {
    const { task } = req.body; // "task" is the input name from the form
    await pool.query("INSERT INTO todos (title) VALUES ($1)", [task]); // Use "title" in SQL query
    res.redirect("/");
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

