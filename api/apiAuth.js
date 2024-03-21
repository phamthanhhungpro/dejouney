const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const secretKey = 'NTNv7j0TuYARvmNMmWXo6fKvM4o6nv/aUi9ryX38ZH+L1bkrnD1ObOQ8JAUmHCBq7Iy7otZcyAagBLHVKvvYaIpmMuxmARQ97jUVG16Jkpkp1wXOPsrF9zwew6TpczyHkHgX5EuLg2MeBuiT/qJACs1J0apruOOJCg/gOtkjB4c=';

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Authenticate user against your database
    if (username === 'admin' && password === 'supersecret@123') {
        // If authentication succeeds, generate a JWT token
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
        res.json({ success: true, message: 'Login successful', token: token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
});

module.exports = router;