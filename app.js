const express = require('express');
const app = express();
const ejsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session')
const mongoose = require('mongoose');
const passport = require('passport');
const { ensureAuthenticated } = require('./configs/auth');
require('./configs/passport')(passport);
let dotenv = require('dotenv');
const PORT = process.env.PORT || 3000;

// Dotenv Grab
if (app.get('env') === 'development') {
    dotenv.config({
        path: './configs/.env'
    })
}

// Session configurations
app.use(session({
    secret: '1234abcd',
    saveUninitialized: false,
    resave: true
}))

// Express configurations
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(ejsLayout);
app.use(flash());
app.use(express.static('./public'))

// MongoDB Connection
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected')
}).catch((err) => {
    console.log(err)
})

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use((req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Get Routers
const indexRoutes = require('./routes/index');
const dashBoardRoutes = require('./routes/dashboard');

app.use('/', indexRoutes);
app.use('/dashboard', ensureAuthenticated, dashBoardRoutes);

app.listen(PORT, () => {
    console.log(`Listening on Port: ${PORT}`);
})
