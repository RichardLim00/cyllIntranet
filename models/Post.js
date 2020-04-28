const mongoose = require('mongoose');
const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likers: {
        type: [{
            id: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: undefined
    },
    haters: {
        type: [{
            id: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: undefined
    },
    postOn: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
