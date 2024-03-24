const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./app-database.db');

// CREATE a new destination
router.post('/', (req, res) => {
    const { Name, IsActive, Content, Links, Description, Avatar, Hotels, Restaurants, Others } = req.body;

    const sql = `INSERT INTO Destination (Name, IsActive, Content, Links, Description, Avatar, Hotels, Restaurants, Others) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [Name, IsActive, Content, Links, Description, Avatar, Hotels, Restaurants, Others];

    db.run(sql, values, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, Name, IsActive, Content, Links, Description, Avatar, Hotels, Restaurants, Others });
    });
});
// READ all destinations
router.get('/', (req, res) => {
    db.all('SELECT * FROM Destination', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
// READ a specific destination by list ids
router.get('/:ids', (req, res) => {
    const ids = req.params.ids;
    db.all('SELECT * FROM Destination WHERE Id IN (?)', [ids], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
// READ a specific destination by Id return single object
router.get('/:id', (req, res) => {
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

// UPDATE a destination
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { Name, IsActive, Content, Links, Description, Avatar, Hotels, Restaurants, Others } = req.body;

    const sql = `UPDATE Destination SET Name = ?, IsActive = ?, Content = ?, Links = ?, Description = ?, Avatar = ?, Hotels = ?, Restaurants = ?, Others = ? 
                 WHERE Id = ?`;
    const values = [Name, IsActive, Content, Links, Description, Avatar, Hotels, Restaurants, Others, id];

    db.run(sql, values, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Destination not found' });
        }
        res.json({ message: 'Destination updated successfully' });
    });
});

// get destinations by list of ids [1,2,3,4,5]
router.get('/list/:ids', (req, res) => {
    const ids = req.params.ids.split(',');
    db.all('SELECT * FROM Destination WHERE Id IN (' + ids.join(',') + ')', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// delete
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM Destination WHERE Id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            return res.status(404).json({ error: 'Destination not found' });
        }
        res.json({ message: 'Destination deleted successfully' });
    }
    );
}
);
module.exports = router;
