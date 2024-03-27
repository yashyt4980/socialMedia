const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateWebToken({_id,email}){
    // console.log(_id,email);
    const token = jwt.sign({ _id,email }, process.env.SECRET_KEY, { expiresIn : "30d" });
    return token;
}

module.exports = generateWebToken;