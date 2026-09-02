const jwt = require("jsonwebtoken");

function verifyToken( req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message: "access denied"
        })
    }
    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.secret);

        req.user = decoded;

        next();
    }
    catch(error){
        return res.status(401).json({
            message: "invalid token"
        })
    }
}

module.exports = verifyToken;