const Database = require('../database');
const db = new Database('login');

const hashPassword = require('../utils/hashpassword');
const comparePassword = require('../utils/comparePassword');

const { SECRET_KEY } = require('../config');
const jwt = require('jsonwebtoken');

async function createLoginUsers(req, res){
    const { username, name, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Nome e senha são obrigatórios" });
    }

    const newUser = { username, name, password: await hashPassword(password), userType: ["user"] };

    db.put(`user_${username}`, JSON.stringify(newUser), (err) => {
        if(err) {
            res.status(500).json({ error: 'Erro ao criar usuário' });
            return;
        }
        res.status(201).json(newUser);
    });
};

const getLogin = async (req, res) => {
    const user = req.user;
    return res.json(user);
};

const autenticate = async (req, res) => {
    const { username, password } = req.body;

    const error = 'Usuário e/ou senha inválidos.';
    if(!username || !password){
        res.cookie('session_id', '', { expires: new Date(0) });
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
    }

    db.get(`user_${username}`, async (err, value) => {
        if(err){
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }
        userObject = JSON.parse(value.toString());
        const match = await comparePassword(password, userObject.password);
        if(!match){
            res.cookie('session_id', '', { expires: new Date(0) });
            return res.status(400).json({ error });
        }

        const user = {
            username: value.username,
            name: value.name,
            userType: value.userType
        };
        
        try{
            const sessionToken = await jwt.sign({ user }, SECRET_KEY);
            res.cookie('session_id', sessionToken, { maxAge: 900000, httpOnly: true });
            res.status(200).json({ sessionToken: sessionToken })
        } catch (error){
            res.status(500).json({ error: 'Erro ao gerar token JWT' })
        }
    });

};

const getAllLogins = (req, res) => {
    db.readAllData((err, data) => {
        if (err) {
            res.status(500).json({ error: "Erro ao buscar usuários" });
            return;
        }
        res.json(data);
    });
};

const updateUser = (req, res) => {
    const userId = req.params.username;
    const { username, name, password, userType } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Nome e e-mail são obrigatórios" });
    }

    if (typeof name !== "string" || name.length < 3 || name.length > 30){
        return res.status(400).json({ error: "O nome deve conter entre 3 e 30 caracteres" });
    }

    db.get(`user_${userId}`, (err, value) => {
        if(err){
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        const updateCustomer = { username, name, password, userType };
        db.put(`user_${userId}`, JSON.stringify(updateCustomer), (err) => {
            if(err) {
                res.status(500).json({ error: 'Erro ao atualizar usuário' });
                return;
            }
            res.json({ message: `Usuário ${username} atualizado` });
        });
    });
};

const deleteUser = (req, res) => {
    const username = req.params.username;

    db.get(`user_${username}`, (err, value) => {
        if(err){
            res.status(404).json({ error: 'Usuário não encontrado' });
            return;
        }

        db.del(`user_${username}`, (err) => {
            if(err){
                res.status(500).json({ error: 'Erro ao excluir usuário' });
                return;
            }
            res.status(200).json({ message: `Usuário ${username} deletado.`});
        });
    });  
};

module.exports = {
    createLoginUsers,
    getLogin,
    autenticate,
    getAllLogins,
    updateUser,
    deleteUser
}