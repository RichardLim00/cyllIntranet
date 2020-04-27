const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const Post = require('../models/Post');
const User = require('../models/User');

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

router.post('/profile/update', upload.none(), async (req, res, next) => {
    const { bio : newBio } = req.body;
    
    // Validation
    if(newBio.trim() === ''){
        res.status(406);
        res.send();
        return;
    }

    // Update User Profile
    try {
        await User.findByIdAndUpdate(req.user._id, {
            biography: newBio
        }, {
            useFindAndModify: false
        })

        res.status(200);
        res.send();
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send();
    }
})

router.post('/createPost', upload.none(), async (req, res, next) => {
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
