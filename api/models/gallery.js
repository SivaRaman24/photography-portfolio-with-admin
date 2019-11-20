const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        // required: true
    },
    description: String,
    keywords: [String],
    featureImageName: String,
    bannerImageName: {
        type: String,
        default: ''
    },
    customUrl: {
        type: String,
        default: ''
    },
    visibility: {
        type: String,
        enum: ['PUBLIC', 'PRIVATE', 'UNLISTED'],
        default: 'PUBLIC'
    },
    password: {
        type: String,
        default: ''
    },
    passwordHint: {
        type: String,
        default: ''
    },
    enableDownloadOption: {
        type: Boolean,
        default: false
    },
    enableShoppingButton: {
        type: Boolean,
        default: false
    },
    enableSharingOption: {
        type: Boolean,
        default: false
    },
    enableCommentSection: {
        type: Boolean,
        default: false
    },
    enableSlideShow: {
        type: Boolean,
        default: false
    },
    styleType: { 
        type: String,
        enum: ['THUMBNAILS', 'COLLAGE LANDSCAPE', 'COLLAGE PORTRAIT', 'JOURNAL', 'SLIDESHOW'],
        default: 'THUMBNAILS' //As of now we are going to support only THUMBNAILS style alone.
    },
    enableCameraInfo: {
        type: Boolean,
        default: false
    },
    ancestors: [String],
    parent: {
        type: String,
        default: null
    },
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