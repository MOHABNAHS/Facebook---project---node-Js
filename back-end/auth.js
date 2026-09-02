const jwt = require("jsonwebtoken");

function generateToken(user){
    return jwt.sign(
        {
            id: user.id,
            username: user.username
        },
        process.env.secret,
        {
            expiresIn:"10m"
        }
    );
}

function generateRefreshToken(user){
    return jwt.sign(
        {
            id: user.id,
            username: user.username            
        },
        process.env.refresh_secret,
        {expiresIn:"7d"}
    );
}

module.exports ={
    generateToken,
    generateRefreshToken
};