const crypto = require('crypto');

let loginUsers = [
    {
        "username": "pedro",
        "name": "Pedro Fernandes",
        "password": "123456",
        "userType": ["admin"],
        "sessionToken": ""
    },

    {
        "username": "kenji",
        "name": "Kenji Taniguchi",
        "password": "654321",
        "userType": ["user"],
        "sessionToken": ""
    }
];

const getLogin = (req, res) => {
    const sessionToken = req.cookies.session_id;

    if (sessionToken){
        const foundUser = loginUsers.filter(user => user.sessionToken === sessionToken);
        if (foundUser.length > 0){
            return res.json({ username: foundUser[0].username, name: foundUser[0].name })
        }
    }

    const error = 'Falha ao tentar obter dados do usuário.';
    res.cookie('session_id', '', { expires: new Date(0) });
    res.json({ error });
};

const autenticate = (req, res) => {
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

    const foundUsername = foundUser[0].username;

    const timestamp = Date.now();
    const sessionToken = crypto.createHash("sha256").update(`${timestamp}`).digest("hex");
    
    const index = loginUsers.findIndex(user => user.username === foundUsername);
    loginUsers[index].sessionToken = sessionToken;

    res.cookie('session_id', sessionToken, { maxAge: 900000, httpOnly: true });
    res.status(200).json({ message: sessionToken })
};

const getAllLogins = (req, res) => {
    return res.status(200).json(loginUsers);
};

const getUsernameLogin = (req, res) => {
    const username = req.params.username;
    const userIndex = loginUsers.findIndex((user) => user.username === username);

    if(userIndex === -1){
        return res.status(400).json({ message: "Usuário não encontrado." });
    }
    
    if (loginUsers[userIndex].userType.find((user) => user === "admin")){
        res.status(200).json(loginUsers[userIndex]);
    } else{
        return res.status(400).json({ message: "Só é possível ver usuários administradores." });
    }

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
        return res.status(400).json({ message: "Só é possível deletar usuários administradores." });
    }
};

const deleteUser = (req, res) => {
    const username = req.params.username;
    const userIndex = loginUsers.findIndex((user) => user.username === username);
    
    if (loginUsers[userIndex].userType.find((user) => user === "admin")){
        loginUsers = loginUsers.filter((user) => user.username !== username);
        res.status(200).json({ message: `Usuário ${username} deletado.`});
    } else{
        return res.status(400).json({ message: "Só é possível deletar usuários administradores." });
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