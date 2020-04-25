const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const Post = require('../models/Post');

router.get('/home', async (req, res, next) => {
    const posts = await Post.find({}).sort({ postOn: 'asc' }).limit(30)
                        .populate('author').exec()

    res.render('dashboard-home', { posts });
})

router.get('/logout', (req, res, next) => {
    req.logOut();
    req.flash('success', 'You\'re Now Logged Out');
    res.redirect('/login');
})

router.get('/profile', (req, res, next) => {
    res.render('profile', { user: req.user});
})

router.post('/createPost', upload.none(), async (req, res, next) => {
    console.log(req.user);
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id
        })

        await newPost.save();
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;
