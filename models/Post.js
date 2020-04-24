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
    likeAmt: {
        type: Number,
        default: 0
    },
    hateAmt: {
        type: Number,
        default: 0
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
