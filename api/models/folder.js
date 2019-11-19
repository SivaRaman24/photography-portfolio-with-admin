const mongoose = require('mongoose');

const folderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId(),
    name: {
        type: String,
        required: true
    },
    description: String,
    keywords: [String],
    featureImageUrl: String,
    customUrl: String,
    privacy: String,
    password: String,
    passwordHint: String,
    ancestors: [String],
    parent: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Folder', folderSchema);