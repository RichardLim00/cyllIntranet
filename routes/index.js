const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();

// Get Index Page
router.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/dashboard/home')
    } else {
        res.render('index')
    }
})

// Get Login Page
router.get('/login', (req, res) => {
    if (req.user) {
        res.redirect('/dashboard/home')
    } else {
        res.render('login')
    }
})

// Post Login Page
router.post('/login', async (req, res, next) => {
    passport.authenticate('local', {
        successFlash: true,
        successRedirect: '/dashboard/home',
        failureFlash: true,
        failureRedirect: '/login'
    })(req, res, next)
})

// Get Signup Page
router.get('/signup', async (req, res) => {
    if (req.user) {
        res.redirect('/dashboard/home')
    } else {
        res.render('signup')
    }
})

// Post Signup Page
router.post('/signup', async (req, res) => {
    const {
        email,
        username,
        password,
        password2
    } = req.body;

    const errors = await validateSignUpForm(email, username, password, password2);
    console.log(typeof errors)
    if (errors.length > 0) {                  // Form is not correct
        res.render('signup', { errors })
    } else {                                  // Form is correct
        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        try {
            await newUser.save();
            req.flash('success', 'Register Success! You May Log In Now.');
            res.redirect('login');
        } catch (err) {
            console.log(err);
            res.render('signup', { email, username, errors: 'Something went wrong... This is still in Beta Version...' });
        }
    }
})

module.exports = router;

async function validateSignUpForm (email, username, password, password2) {
    const errors = [];

    // Email
    if (email.trim() === '') {                                    // Empty Email
        errors.push({ msg: 'Please Fill in Email Address' });
    } else if (!/\w+@[a-zA-Z]+.com/.test(email)) {                // Incorrect Email Format
        errors.push({ msg: 'Incorrect Email Format' });
    }

    try {
        const userOfEmail = await User.findOne({ email })
        if (userOfEmail) {
            errors.push({ msg: `'${email}' is already Registered.` })
        }
    } catch (error) {
        console.log(error);
    }

    // Username
    if (username.trim() === '') {                                 // Empty Username
        errors.push({ msg: 'Please Fill in Username' });
    }

    // Password
    if (password !== password2) {
        errors.push({ msg: 'Passwords Don\'t Match' })
    }

    return errors;
}

async function hashPassword (unhashed) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(unhashed, salt);
    return hashed;
}
