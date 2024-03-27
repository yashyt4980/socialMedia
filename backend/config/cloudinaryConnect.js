// const cloudinary = require('cloudinary').v2;
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const colors = require('colors');
cloudinaryConnect = () => {
    try {
        cloudinary.config({
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        })
        console.log('Connected cloudinary successfully'.cyan.underline);
    }
    catch(error) {
        console.log(('Cant establish connection -> ' + error.message).red.bold);
    }
}

module.exports = { cloudinaryConnect }