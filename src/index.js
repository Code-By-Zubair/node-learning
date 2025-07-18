
const express = require('express');
const logger = require('./middleware/loggers');
const app = express();
const Port = process.env.PORT || 3000;
const connectDB = require('./config/db');

require('dotenv').config();
app.use(express.json());
app.use(logger);
connectDB();

const userRoutes = require('./routes/users');

app.use('/api/users', userRoutes);
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// dummy route
app.get('/', (req, res) => {
    res.send(

        "Welcome to my API! This is a simple Express server running on port 3000."
    )
});



app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});