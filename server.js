const express = require('express');
const cors = require('cors');

//sql connection
const mysql = require('mysql2');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

//databse
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'todo_db',
});

// get tasks all
app.get('/tasks', (req, res) => {
    pool.query('SELECT * FROM tasks', (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.json(results);
    });
});


app.post('/tasks', (req, res) => {
    const { taskName, deadline } = req.body;
    pool.query(
        'INSERT INTO tasks (task_name, deadline) VALUES (?, ?)',
        [taskName, deadline],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            res.status(201).json({ id: results.insertId, taskName, deadline, completed: false });
        }
    );
});


app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM tasks WHERE id = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.json({ message: 'Task deleted successfully' });
    });
});





//checlk server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
