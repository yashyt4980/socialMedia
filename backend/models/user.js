const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    Photo: {
        type: String,
        required: true,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "USER" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "USER" }]
})

module.exports = mongoose.model("USER", userSchema);