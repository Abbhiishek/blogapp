const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;
const { checkforAuthenticatedUser } = require('./libs/auth')
// get all routes

const HomeRouter = require('./routes/home');
const Blogrouter = require('./routes/blog');
const Blog = require('./models/blog');

// connect to the database
const db = mongoose.connect(process.env.MONOGODB_URI)
    .then((db, err) => {
        if (err) console.log(err)
        if (db) console.log("the database connected ")
    })


app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser());
app.use(checkforAuthenticatedUser('token'));


app.use('/', require('./routes/home'));
app.use('/blog', require('./routes/blog'));

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});