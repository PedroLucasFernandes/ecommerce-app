const hashPassword = require('../utils/hashpassword');
const comparePassword = require('../utils/comparePassword');

const { SECRET_KEY } = require('../config');
const jwt = require('jsonwebtoken');

async function createAdmin(){
    const username = "kenji";
    const name = "Kenji Taniguchi";
    const password = await hashPassword("123456");
    const userType = [ "admin", "user" ];
    return { username, name, password, userType };
};

async function createUser(){
    const username = "samir";
    const name = "Samir";
    const password = await hashPassword("654321");
    const userType = [ "user" ];
    return { username, name, password, userType };
};

async function createLoginUsers(){
    const adminUser = await createAdmin();
    const commonUser = await createUser();
    return [ adminUser, commonUser ];
};

const getLogin = async (req, res) => {
    const user = req.user;
    return res.json(user);
};

const autenticate = async (req, res) => {
    let loginUsers = await createLoginUsers();
    
    const { username, password } = req.body;

    const error = 'Usuário e/ou senha inválidos.';
    if(!username || !password){
        res.cookie('session_id', '', { expires: new Date(0) });
        return res.status(400).json({ error });
    }

    const foundUser = loginUsers.filter(user => user.username === username && user.password === password);
    if (foundUser.length === 0){
        res.cookie('session_id', '', { expires: new Date(0) });
        return res.status(400).json({ error });
    }

    const match = await comparePassword(password, foundUser[0].password);

    if(!match){
        res.cookie('session_id', '', { expires: new Date(0) });
        return res.status(400).json({ error });
    }

    const user = {
        username: foundUser[0].username,
        name: foundUser[0].name,
        userType: foundUser[0].userType
    };

    try{
        const sessionToken = await jwt.sign({ user }, SECRET_KEY);
        res.cookie('session_id', sessionToken, { maxAge: 900000, httpOnly: true });
        res.status(200).json({ sessionToken: sessionToken })
    } catch (error){
        res.status(500).json({ error: 'Erro ao gerar token JWT' })
    }
};

const getAllLogins = (req, res) => {
    return res.status(200).json(loginUsers);
};

const getUsernameLogin = (req, res) => {
    const user = req.user;
    return res.json(user);

};

const updateUser = (req, res) => {
    const userToUpdate = req.params.username;
    const { username, password } = req.body;

    const userIndex = loginUsers.findIndex((user) => user.username === userToUpdate);

    if(userIndex === -1){
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (loginUsers[userIndex].userType.find((user) => user === "admin")){
        loginUsers[userIndex] = { ...loginUsers[userIndex], username, password };
        res.status(200).json({ message: `Usuário ${username} atualizado.`});
    } else{
        return res.status(400).json({ message: "Somente administradores têm autorização para isso!" });
    }
};

const deleteUser = (req, res) => {
    const username = req.params.username;
    const userIndex = loginUsers.findIndex((user) => user.username === username);
    
    if (loginUsers[userIndex].userType.find((user) => user === "admin")){
        loginUsers = loginUsers.filter((user) => user.username !== username);
        res.status(200).json({ message: `Usuário ${username} deletado.`});
    } else{
        return res.status(400).json({ message: "Somente administradores têm autorização para isso!" });
    }
};

module.exports = {
    loginUsers,
    getLogin,
    autenticate,
    getAllLogins,
    getUsernameLogin,
    updateUser,
    deleteUser
}