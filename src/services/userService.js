
const users = require('../data/users');

// Fetch all users
const getAllUsers =()=> users;

// Find user by ID
const getUserById = (id)=> {
    return users.find(user => user.id === id);
}

// Find user by email
const getUserByEmail = (email)=> {
    return users.find(user => user.email === email);
}

// create a new user
const createUser = (newUser)=> {
    const existingUser = users.find(user => user.email === newUser.email);
    if(existingUser) {
        throw new Error('User already exists');
    }
    newUser.id = users.length + 1; // Simple ID generation
    users.push(newUser);
    return newUser;
}

// Update user by ID
const updateUser = (id, updateUser)=> {
    const userIndex = users.findIndex(user => user.id === id);
    if(userIndex === -1){
        throw new Error('User not found');
    }
    const user = users[userIndex];
    users[userIndex] = {...user, ...updateUser};
    return users[userIndex];
}
// Delete user by ID
const deleteUser = (id)=> {
    const userIndex = users.findIndex(user => user.id === id);
    if(userIndex === -1){
        throw new Error('User not found');
    }
    const deletedUser = users.splice(userIndex, 1);
    return deletedUser[0];
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
};