const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const userResult =  await User.findOne({ email: email });

                if (userResult) {
                    bcrypt.compare(password, userResult.password)
                        .then((passwordMatched) => {
                            if (passwordMatched) {
                                return done(null, userResult);
                            } else {
                                return done(null, false, { message: 'Incorrect Password' });
                            }
                        })
                } else {
                    return done(null, false, { message: 'User Doesn\'t Exist' });
                }
            } catch (err) {
                console.log(err);
            }
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((userID, done) => {
        User.findById(userID, (err, user) => {
            done(err, user)
        })
    })
}
