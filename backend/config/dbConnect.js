const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
require("dotenv").config();
const colors = require('colors');
const dbConnect = asyncHandler(
    async() => {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URL);
            if(conn) {
                console.log(`Mongodb Connection Successfull `.underline.cyan);
            }
        } catch(error) {
            console.log(("some error has occured while connecting to mongodb -> " + error.message).underline.red);
        }
    }
)
module.exports = { dbConnect };