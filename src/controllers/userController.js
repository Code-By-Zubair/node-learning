const bcrypt = require('bcryptjs');
const dummyUsers = require('../data');
let users = dummyUsers;
const getUsers = (req,res)=>{
    res.json(users);
}

// post api

const createUser=(req,res)=>{
    const {name} = req.body;
    if(!name){
        return res.status(400).json({error: 'Name is required'});
    }
    const existingUser = users.find(user => user.name === name);
    if(existingUser){
        return res.status(409).json({error: 'User already exists'});
    }
    const newUser = {
        id: users.length + 1,
        name
    };
    users.push(newUser);
    res.status(201).json(newUser);
};

const updateUser =(req, res)=> {
    const userId = parseInt(req.params.id, 10);
    const { name, email, password } = req.body;
    // log all users
    console.log(users);
    const user = users.find(u=> u.id === userId);

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
    const userIndex = users.findIndex(u => u.id === userId);
    if(userIndex === -1){
        return res.status(404).json({ error: 'User not found' });
    }
    users.splice(userIndex, 1);
    res.json({ message: 'User deleted successfully' });
}
module.exports = {
    getUsers,
    createUser,
    updateUser,
    delteUser,
};