const express = require("express");
require("dotenv").config();
var cors = require('cors');
const app = express();
app.use(cors());
const { dbConnect } = require('./config/dbConnect');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { cloudinaryConnect } = require('./config/cloudinaryConnect');
const fileUpload = require('express-fileupload');
const path = require("path");
const __dirname = path.resolve();
cloudinaryConnect();
dbConnect();
app.use(fileUpload());
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'))
});
app.listen(process.env.PORT, () => {
    console.log(`
Server is running at ${process.env.PORT}`.underline.cyan);
});