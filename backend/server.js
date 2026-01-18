const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger
if (process.env.NODE_ENV === 'development') {
    app.use(require('morgan')('dev'));
} else {
    app.use(require('morgan')('combined'));
}

// Health Check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'API Live', time: new Date() });
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/vibes', require('./src/routes/vibeRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
