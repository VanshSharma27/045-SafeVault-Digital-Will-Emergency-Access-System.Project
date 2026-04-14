const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        priority TEXT DEFAULT 'Medium',
        isDone INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

app.get('/tasks', (req, res) => {
    db.all("SELECT * FROM tasks ORDER BY isDone ASC, id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/tasks', (req, res) => {
    const { title, description, priority } = req.body;
    db.run(`INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)`, 
    [title, description, priority], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, title, description, priority, isDone: 0 });
    });
});

app.put('/tasks/:id', (req, res) => {
    const { title, priority, description } = req.body;
    db.run(`UPDATE tasks SET title = ?, priority = ?, description = ? WHERE id = ?`, 
    [title, priority, description, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.patch('/tasks/:id/status', (req, res) => {
    db.run(`UPDATE tasks SET isDone = ? WHERE id = ?`, [req.body.isDone, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/tasks/:id', (req, res) => {
    db.run(`DELETE FROM tasks WHERE id = ?`, req.params.id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));