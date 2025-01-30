require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to database'))
.catch(err => console.error('Error connecting to database:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true }
});

const User = mongoose.model('User', userSchema);

// POST API Endpoint to store user data
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        
        // Validate input data
        if (!name || !email || !age) {
            return res.status(400).json({ message: 'Validation error: All fields are required' });
        }
        
        // Create a new user
        const newUser = new User({ name, email, age });
        await newUser.save();
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
