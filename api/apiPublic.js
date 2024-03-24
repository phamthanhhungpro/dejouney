const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./app-database.db');

// READ a specific destination by list ids
router.get('/destination/:ids', (req, res) => {
    const ids = req.params.ids;
    db.all('SELECT * FROM Destination WHERE Id IN (?)', [ids], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
// READ a specific destination by Id return single object
router.get('/destination/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM Destination WHERE Id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Destination not found' });
        }
        res.json(row);
    });
});

// get destinations by list of ids [1,2,3,4,5]
router.get('/destination/list/:ids', (req, res) => {
    const ids = req.params.ids.split(',');
    db.all('SELECT * FROM Destination WHERE Id IN (' + ids.join(',') + ')', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Get a specific trip by ID
router.get('/trip/:id', (req, res) => {
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

router.post('/trip/visitor-login', (req, res) => {
    const { username, password, id } = req.body;

    const query = `SELECT * FROM Trip WHERE Id = ?`;
    const values = [id];

    db.get(query, values, (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve trip' });
        } else if (!row) {
            res.status(404).json({ error: 'Trip not found' });
        } else {
            console.log(row);
            // get trip username and password
            const tripUsername = row.UserName;
            const tripPassword = row.PassWord;

            if (tripUsername === username && tripPassword === password) {
                res.json({ success: true, message: 'Login successful', token: username+password });
            }
            else {
                res.status(401).json({ error: 'Invalid username or password' });
            }
        }
    });
});

module.exports = router;
