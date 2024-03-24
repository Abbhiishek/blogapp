const { Router } = require('express');
const Blog = require('../models/blog');
const multer = require('multer');
const path = require('path');
const Blogrouter = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})


const upload = multer({ storage: storage });



Blogrouter.get('/create', (req, res) => {
    res.render('createblog', {
        user: req.user
    });
})


Blogrouter.post('/post', upload.single('coverImage'), async (req, res) => {
    const { title, description, body } = req.body;
    console.log(req.file);
    const blog = await Blog.create({
        title,
        description,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        author: req.user.id
    });

    return res.redirect('/blog/' + blog._id);
})



Blogrouter.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('author');
    console.log(blog);
    res.render('blog', {
        blog,
        user: req.user
    });
})

module.exports = Blogrouter;