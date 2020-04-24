module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.locals.loggedIn = true;
            return next();
        }

        req.flash('error', 'You\'re not logged in.');
        res.redirect('/login');
    }
}
