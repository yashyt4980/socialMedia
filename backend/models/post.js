const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true,
        default: "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "USER" }],
    comments: [{
        comment: { type: String },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "USER" }
    }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER",
        required:true,
    },
}, { timestamps: true })

module.exports = mongoose.model("POST", postSchema)