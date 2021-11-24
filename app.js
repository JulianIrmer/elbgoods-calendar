const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const entryRoutes = require('./routes/entry');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

// DB conntection
const mongo_options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
};
  
mongoose.connect(DB_URL, mongo_options, (err) => {
    console.log('trying to connect to db..');
    if (err) {
        console.error(err);
    } else {
        console.log('Connected to MongoDB...');
    }
});

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/v1/entry', entryRoutes);

app.listen(PORT, (err) => {
    if (err) console.error(err);

    console.log(`Server running on port ${PORT}`);
});