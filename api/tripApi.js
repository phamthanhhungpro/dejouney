const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./app-database.db');

// Create a new trip
router.post('/', (req, res) => {
    const { Name, Client, UserName, PassWord, ExpriredOn, CreatedAt, FlightInfo, ReminderInfo, DestinationIds } = req.body;
    const query = `INSERT INTO Trip (Name, Client, UserName, PassWord, ExpriredOn, CreatedAt, FlightInfo, ReminderInfo, DestinationIds) 
                                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    // CreatedAt is the current date
    const CreatedDate = new Date();                           
    // ExpriredOn is 90 days from CreatedDate
    const ExpriredDate = new Date(CreatedDate);
    ExpriredDate.setDate(ExpriredDate.getDate() + 90);

    const values = [Name, Client, UserName, PassWord, ExpriredDate, CreatedDate, FlightInfo, ReminderInfo, DestinationIds];

    db.run(query, values, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create trip' });
        } else {
            res.status(201).json({ tripId: this.lastID });
        }
    });
});

// Get all trips
router.get('/', (req, res) => {
    const query = `SELECT * FROM Trip`;

    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve trips' });
        } else {
            res.status(200).json(rows);
        }
    });
});

// Get a specific trip by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM Trip WHERE Id = ?`;
    const values = [id];

    db.get(query, values, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve trip' });
        } else if (!row) {
            res.status(404).json({ error: 'Trip not found' });
        } else {
            res.status(200).json(row);
        }
    });
});

// Update a trip by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { Name, Client, UserName, PassWord, ExpriredOn, CreatedAt, FlightInfo, ReminderInfo, DestinationIds } = req.body;
    const query = `UPDATE Trip SET Name = ?, Client = ?, UserName = ?, PassWord = ?, ExpriredOn = ?, CreatedAt = ?, 
                                 FlightInfo = ?, ReminderInfo = ?, DestinationIds = ? WHERE Id = ?`;
    const values = [Name, Client, UserName, PassWord, ExpriredOn, CreatedAt, FlightInfo, ReminderInfo, DestinationIds, id];

    db.run(query, values, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to update trip' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Trip not found' });
        } else {
            res.status(200).json({ message: 'Trip updated successfully' });
        }
    });
});

// Delete a trip by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM Trip WHERE Id = ?`;
    const values = [id];

    db.run(query, values, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete trip' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Trip not found' });
        } else {
            res.status(200).json({ message: 'Trip deleted successfully' });
        }
    });
});

module.exports = router;


module.exports = router;
