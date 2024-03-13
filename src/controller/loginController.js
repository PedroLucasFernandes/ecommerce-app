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
    res.status(200).json({ success: true })
};

module.exports = {
    loginUsers,
    getLogin,
    autenticate
}