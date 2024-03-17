const { SECRET_KEY } = require("../config");
const jwt = require("jsonwebtoken");

function permissionVerify(req, res, next){
    const sessionToken = req.cookies.session_id;

    if(!sessionToken){
        return res.status(401).json({ error: "Token JWT ausente" });
    }

    jwt.verify(sessionToken, SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(403).json({ error: "Token JWT inválido" });
        } else{
            req.user = decoded.user;
            next();
        }
    });
};

module.exports = permissionVerify;