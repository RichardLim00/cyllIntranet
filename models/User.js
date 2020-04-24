const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    biography: {
        type: String,
        default: 'No Biography... Suggestion?'
    },
    blogsCreated: {
        type: Number,
        default: 0
    },
    friends: {
        type: Array
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;
