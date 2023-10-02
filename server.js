const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();
// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Tulips22!",
  database: "movies_db",
});

// movies api ('api/movies)
app.get("/api/movies", (req, res) => {
  const sql = `SELECT id, movie_name AS title FROM movies`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.status(200).json({ message: "success", data: rows });
  });
});

app.post("/api/movies", (req, res) => {
  const { body } = req;

  const sql = `INSERT INTO movies (movie_name) 
  VALUES (?)`;

  const params = [body.movie_name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.status(200).json({
      message: "success",
      data: {
        id: result.insertId,
        ...body,
      },
    });
  });
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});
