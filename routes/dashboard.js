const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const sanitizer = require('sanitizer');
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

router.get('/profile', async (req, res) => {

    const user = await User.findById(req.user.id).populate('friends');

    res.render('profile', { user: user });
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
            const user = await User.findById(req.params.id).populate('friends');
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

        const filteredPosts = filterPostsDetail(posts, req);                        
        
        res.send(filteredPosts);
    } catch (error) {
        res.status(400);
        res.send();
        console.log(error)
    }
})

router.post('/likePost/:postID' , async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID);

        if (!post) {
            res.status(400).end();
        }

        if (post.haters.includes(req.user._id)) {
            await post.updateOne({$pull: {haters: req.user._id}})
        }

        if(!post.likers.includes(req.user._id)) {
            await post.updateOne({$push: {likers: req.user._id}})
        } else {
            await post.updateOne({$pull: {likers: req.user._id}})
        }

        res.status(200);
    } catch (err) {
        console.log(err);
        res.status(400);
    }
})

router.post('/hatePost/:postID' , async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID);

        if (!post) {
            res.status(400).end();
        }

        if (post.likers.includes(req.user._id)) {
            await post.updateOne({$pull: {likers: req.user._id}})
        }

        if(!post.haters.includes(req.user._id)) {
            await post.updateOne({$push: {haters: req.user._id}})
        } else {
            await post.updateOne({$pull: {haters: req.user._id}})
        }

        res.status(200);
    } catch (err) {
        console.log(err);
        res.status(400);
    }
})

module.exports = router;

function filterPostsDetail(rawPosts, req){
    const filteredPosts = rawPosts.map((post) => {
        let filteredPost = {}

        filteredPost.id = post._id;
        filteredPost.author = {};
        filteredPost.author.id = post.author._id;
        filteredPost.author.username = post.author.username;
        filteredPost.content = sanitizer.escape(post.content);
        filteredPost.likers = post.likers.length;
        filteredPost.haters = post.haters.length;
        filteredPost.postOn = post.postOn;
        filteredPost.title = sanitizer.escape(post.title);
        filteredPost.userLike = post.likers.includes(req.user._id);
        filteredPost.userHate = post.haters.includes(req.user._id);

        return filteredPost;
    })

    return filteredPosts;
}
