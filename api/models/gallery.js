const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    description: String,
    keywords: [String],
    featureImageUrl: String,
    bannerImageUrl: String,
    customeUrl: String,
    visibility: String,
    password: String,
    passwordHint: String,
    enableDownloadOption: Boolean,
    enableShoppingButton: Boolean,
    enableSharingOption: Boolean,
    enableCommentSection: Boolean,
    enableSlideShow: Boolean,
    styleType: String,
    enableCameraInfo: Boolean,
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



module.exports = mongoose.model('Gallery', gallerySchema);