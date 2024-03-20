const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./app-database.db');

// CREATE a new reminder
router.post('/', (req, res) => {
    const { TripId, Title, Line1, Line2, Line3, Line4 } = req.body;

    const sql = `INSERT INTO Reminder (TripId, Title, Line1, Line2, Line3, Line4) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [TripId, Title, Line1, Line2, Line3, Line4];

    db.run(sql, values, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, TripId, Title, Line1, Line2, Line3, Line4 });
    });
});

// READ all reminders
router.get('/', (req, res) => {
    db.all('SELECT * FROM Reminder', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// READ reminders for a specific trip by TripId
router.get('/trip/:tripId', (req, res) => {
    const tripId = req.params.tripId;
    db.all('SELECT * FROM Reminder WHERE TripId = ?', [tripId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// UPDATE a reminder
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { TripId, Title, Line1, Line2, Line3, Line4 } = req.body;

    const sql = `UPDATE Reminder SET TripId = ?, Title = ?, Line1 = ?, Line2 = ?, Line3 = ?, Line4 = ? 
                 WHERE Id = ?`;
    const values = [TripId, Title, Line1, Line2, Line3, Line4, id];

    db.run(sql, values, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Reminder not found' });
        }
        res.json({ message: 'Reminder updated successfully' });
    });
});

// DELETE a reminder
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM Reminder WHERE Id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Reminder not found' });
        }
        res.json({ message: 'Reminder deleted successfully' });
    });
});

module.exports = router;
