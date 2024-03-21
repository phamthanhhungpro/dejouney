const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken package

const tripApi = require('./api/tripApi');
const commentApi = require('./api/commentApi');
const reminderApi = require('./api/remindApi');
const destinationApi = require('./api/destinationApi');
const uploadFileApi = require('./api/apiUploadFile');
const authApi = require('./api/apiAuth');

const app = express();
const PORT = process.env.PORT || 3000;

// Define secret key for JWT
const secretKey = 'NTNv7j0TuYARvmNMmWXo6fKvM4o6nv/aUi9ryX38ZH+L1bkrnD1ObOQ8JAUmHCBq7Iy7otZcyAagBLHVKvvYaIpmMuxmARQ97jUVG16Jkpkp1wXOPsrF9zwew6TpczyHkHgX5EuLg2MeBuiT/qJACs1J0apruOOJCg/gOtkjB4c='; // Replace this with your actual secret key

// Middleware
app.use(bodyParser.json());

// Middleware for verifying JWT token
const verifyToken = (req, res, next) => {
    const fulltoken = req.headers['authorization'];
    console.log('fulltoken:', fulltoken);
    if (!fulltoken) return res.status(200).json({ success: false, message: 'Token not provided' });

    token = fulltoken.split(' ')[1];

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('JWT verification failed:', err.message);
            console.error('JWT verification failed:', token);
            return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
};

// Apply token verification middleware to protected routes
app.use(['/api/trips', '/api/comments', '/api/reminders', '/api/destinations', '/api/uploads'], verifyToken);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use route files
app.use('/api/trips', tripApi);
app.use('/api/comments', commentApi);
app.use('/api/reminders', reminderApi);
app.use('/api/destinations', destinationApi);
app.use('/api/uploads', uploadFileApi);
app.use('/api/auth', authApi);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
