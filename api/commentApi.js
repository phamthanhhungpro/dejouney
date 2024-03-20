const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./app-database.db');

// CREATE a new comment
router.post('/', (req, res) => {
    const { TripId, UserName, Content, Links, IsApproved } = req.body;

    const createdAt = new Date().toISOString(); // Current timestamp for createdAt field

    const sql = `INSERT INTO Comment (TripId, UserName, Content, Links, CreatedAt, IsApproved) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [TripId, UserName, Content, Links, createdAt, IsApproved];

    db.run(sql, values, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, TripId, UserName, Content, Links, CreatedAt: createdAt, IsApproved });
    });
});

// READ all comments
router.get('/', (req, res) => {
    db.all('SELECT * FROM Comment', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// READ comments for a specific trip by TripId
router.get('/trip/:tripId', (req, res) => {
    const tripId = req.params.tripId;
    db.all('SELECT * FROM Comment WHERE TripId = ?', [tripId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// UPDATE a comment
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { TripId, UserName, Content, Links, IsApproved } = req.body;

    const sql = `UPDATE Comment SET TripId = ?, UserName = ?, Content = ?, Links = ?, 
                 IsApproved = ? WHERE Id = ?`;
    const values = [TripId, UserName, Content, Links, IsApproved, id];

    db.run(sql, values, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json({ message: 'Comment updated successfully' });
    });
});

// DELETE a comment
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM Comment WHERE Id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json({ message: 'Comment deleted successfully' });
    });
});

module.exports = router;
