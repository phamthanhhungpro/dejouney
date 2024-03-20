const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const tripApi = require('./api/tripApi');
const commentApi = require('./api/commentApi');
const reminderApi = require('./api/remindApi');
const destinationApi = require('./api/destinationApi');
const uploadFileApi = require('./api/apiUploadFile');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use route files
app.use('/api/trips', tripApi);
app.use('/api/comments', commentApi);
app.use('/api/reminders', reminderApi);
app.use('/api/destinations', destinationApi);
app.use('/api/uploads', uploadFileApi);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
