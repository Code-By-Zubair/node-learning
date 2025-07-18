

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // const existingUser = users.find(user => user.email === email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: 'user' // default role
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    // const user = users.find(user => user.email === email);
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
    }
    // const token = jwt.sign({
    //     id: user.id,
    //     email: user.email,
    //     role: user.role
    // }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

module.exports = {

    registerUser,
    loginUser
};