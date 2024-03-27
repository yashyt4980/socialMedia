const bcrypt = require('bcryptjs');

async function hashIt(password) {
    let newPassword = await bcrypt.hash(password,10)
    return newPassword;
}

async function isSame(hashed_password, password) {
    const areSame = await bcrypt.compare(password, hashed_password);
    return areSame;
}

module.exports = { hashIt, isSame };