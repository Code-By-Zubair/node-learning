const bcrypt = require('bcryptjs');
const getUsers = (req,res)=>{
    res.json(require('../data/users'));
}

// post api

const createUser=(req,res)=>{
    const {name} = req.body;
    if(!name){
        return res.status(400).json({error: 'Name is required'});
    }
    const existingUser = require('../data/users').find(user => user.name === name);
    if(existingUser){
        return res.status(409).json({error: 'User already exists'});
    }
    const newUser = {
        id: users.length + 1,
        name
    };
    require('../data/users').push(newUser);
    res.status(201).json(newUser);
};

const updateUser =(req, res)=> {
    const userId = parseInt(req.params.id, 10);
    const { name, email, password } = req.body;
    
    const user = require('../data/users').find(u => u.id === userId);

    if(!user){
        return res.status(404).json({ error: 'User not found' });
    }
    if(name) user.name = name;
    if(email) user.email = email;
    if(password){
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(password, salt);

    }
    res.json({ message: 'User updated successfully', user });

};

// delte user
const delteUser = (req, res)=> {
    const userId = parseInt(req.params.id, 10);
    const userIndex = require('../data/users').findIndex(u => u.id === userId);
    if(userIndex === -1){
        return res.status(404).json({ error: 'User not found' });
    }
    require('../data/users').splice(userIndex, 1);
    res.json({ message: 'User deleted successfully' });
}

const getUserById =(req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = require('../data/users').find(u => u.id === userId);
    if(!user){
        return res.status(404).json({ error: 'User not found' });
    }
    // return user without password
    const {password, ...userWithoutPassword} = user;
    res.json(userWithoutPassword);

}
module.exports = {
    getUsers,
    createUser,
    updateUser,
    delteUser,
    getUserById,
};