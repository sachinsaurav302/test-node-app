const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 5050;

// MySQL Setup
const mysqlConnection = mysql.createConnection({
    host: 'database-1.cnaiqec481hz.ap-south-1.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'one787023',
    database: 'mydb'
});

// Connect MySQL once at server start
mysqlConnection.connect(err => {
    if (err) {
        console.error('MySQL Connection Error:', err);
    } else {
        console.log('Connected to MySQL database');

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users1 (
                id INT AUTO_INCREMENT PRIMARY KEY,
                Username VARCHAR(255),
                email VARCHAR(255)
            )
        `;
        mysqlConnection.query(createTableQuery, (err, result) => {
            if (err) console.error('Error creating table:', err);
            else console.log('MySQL table ready.');
        });
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ✅ Health Check Endpoint
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// GET all users
app.get("/getUsers", (req, res) => {
    mysqlConnection.query('SELECT * FROM users1', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching user');
        }
        res.json(results);
    });
});

// POST new user
app.post("/addUser", (req, res) => {
    const { Username, email } = req.body;

    const query = 'INSERT INTO users1 (Username, email) VALUES (?, ?)';
    mysqlConnection.query(query, [Username, email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding user');
        }
        res.send('User added successfully');
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
