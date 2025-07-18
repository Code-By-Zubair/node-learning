
const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');



// Get /api/users

router.get('/', getUsers);

// Post /api/users
router.post('/', createUser);

// Middleware to protect routes
router.get('/protected',protect, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
});
// Update user
router.put('/:id', protect, (req, res) => {
    const { updateUser } = require('../controllers/userController');
    updateUser(req, res);
});
// Delete user
router.delete('/:id', protect, (req, res) => {
    const { deleteUser } = require('../controllers/userController');
    deleteUser(req, res);
});
    
router.get('/:id', protect, (req, res)=>{
    const { getUserById } = require('../controllers/userController');
    getUserById(req, res);
});



module.exports = router;