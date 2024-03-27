const express = require("express");
const app = express();
require("dotenv").config();
var cors = require('cors');
app.use(cors());
const { dbConnect } = require('./config/dbConnect');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { cloudinaryConnect } = require('./config/cloudinaryConnect');
const fileUpload = require('express-fileupload');
cloudinaryConnect();
dbConnect();
app.use(fileUpload());
app.use(express.json());
app.get('/', (req,res) => {
    return res.json({
        data: "Server is runing"
    })
})
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.listen(process.env.PORT, () => {
    console.log(`
Server is running at ${process.env.PORT}`.underline.cyan);
});