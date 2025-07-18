const bcrypt = require('bcryptjs');
const User = require('../models/user');

// GET: all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// POST: create user
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        const { password: _, ...userWithoutPassword } = newUser.toObject();

        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// PUT: update user
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.user.role !== 'admin' && req.user.id !== user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this user' });
        }

        let updatedPassword = user.password;
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            updatedPassword = bcrypt.hashSync(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name: name || user.name,
                email: email || user.email,
                password: updatedPassword,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).json({ error: 'Failed to update user' });
        }

        const { password: _, ...userWithoutPassword } = updatedUser.toObject();
        res.json({ message: 'User updated successfully', user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// DELETE: delete user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.user.role !== 'admin' && req.user.id !== user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this user' });
        }

        const deleted = await User.findByIdAndDelete(userId);
        if (!deleted) {
            return res.status(500).json({ error: 'Failed to delete user' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// GET: user by ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.user.role !== 'admin' && req.user.id !== user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to view this user' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
};
