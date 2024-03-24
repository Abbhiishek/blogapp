const { Router } = require('express');
const User = require('../models/user');
const cookieParser = require('cookie-parser');
const Blog = require('../models/blog');
const router = Router();


router.get('/', async (req, res) => {
    const blogs = await Blog.find().populate('author');
    res.render('home', {
        user: req.user,
        blogs
    });
});


router.get('/signin', (req, res) => {
    res.render('signin');
});


router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.authenticate(email, password);
        return res.cookie('token', token).redirect('/');
    } catch (error) {
        return res.render('signin', { error: 'Email or password is not correct' })
    }
});


router.get('/register', (req, res) => {
    res.render('register');
});


router.post('/register', async (req, res) => {
    const { email, password, fullname } = req.body;
    try {
        await User.create({
            email,
            password,
            fullname
        })
    } catch (error) {
        return res.render('register', { error: 'Something went wrong' })
    }

    return res.redirect('/signin');
});



router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});


module.exports = router;