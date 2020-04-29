const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const Post = require('../models/Post');
const User = require('../models/User');

router.get('/home', async (req, res) => {
    const posts = await Post.find({}).sort({ postOn: 'asc' }).limit(30)
                        .populate('author').exec()

    res.render('dashboard-home', { posts });
})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'You\'re Now Logged Out');
    res.redirect('/login');
})

router.get('/profile', (req, res) => {
    res.render('profile', { user: req.user});
})

router.post('/profile/update', upload.none(), async (req, res) => {
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

router.post('/profile/delete', async (req, res) => {
    const { _id: userID } = req.user;

    console.log(userID);

    try {
        await User.findByIdAndDelete(userID);

        res.status = 200;
        res.send();
    } catch (err) {
        res.status = 500;
        res.send();
    }
})

router.get('/profile/user/:id', async (req, res) => {
    if(String(req.user._id) === req.params.id){
        res.redirect('/dashboard/profile');
    } else {
        try {
            const user = await User.findById(req.params.id);
            let isFriend = false;

            if(!user){
                res.status(400).end();
            } else {
                isFriend = req.user.friends.includes(user._id);
            }


            res.render('profile', {user: user, otherUser: true, isFriend: isFriend});
            res.status(200).end();
        } catch (err) {
            console.log(err);
            res.status(400).end();
        }
    }
})

router.post('/profile/user/add/:id' , async (req, res) => {
    try {
        let friend = await User.findById(req.params.id);

        console.log("Test: " + req.user.friends.includes(friend._id))
        if(friend){
            if(!req.user.friends.includes(friend._id)){
                await User.findByIdAndUpdate(req.user._id, {$push: {friends: friend._id}})
                await User.findByIdAndUpdate(friend._id, {$push: {friends: req.user._id}})
            }
        }

        res.status(200).end();
    } catch (error) {
        console.log(error);
        res.status(400).end();
    }
})

router.post('/createPost', upload.none(), async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            author: req.user._id
        })

        const newBlogsCreated = req.user.blogsCreated + 1;
        
        await newPost.save();
        await User.findByIdAndUpdate(req.user._id, {blogsCreated: newBlogsCreated},{useFindAndModify: false})
        res.status(200);
        res.send()
    } catch (err) {
        console.log(err)
        res.status(400);
        res.send()
    }
})

router.get('/loadPosts', async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ postOn: 'asc' }).limit(30)
                        .populate('author').exec();

        const filteredPosts = filterPostsDetail(posts);                        
        
        res.send(filteredPosts);
    } catch (error) {
        res.status(400);
        res.send();
        console.log(error)
    }
})

module.exports = router;

function filterPostsDetail(rawPosts){
    const filteredPosts = rawPosts.map((post) => {
        let filteredPost = {}

        filteredPost.id = post._id;
        filteredPost.author = {};
        filteredPost.author.id = post.author._id;
        filteredPost.author.username = post.author.username;
        filteredPost.content = post.content;
        filteredPost.likers = post.likers.length;
        filteredPost.haters = post.haters.length;
        filteredPost.postOn = post.postOn;
        filteredPost.title = post.title;

        return filteredPost;
    })

    return filteredPosts;
}
