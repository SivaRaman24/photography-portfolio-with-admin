const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const Gallery = require('../models/gallery');

const API_URL = 'http://127.0.0.1:3000/';
const GALLERY_API_URL = API_URL + 'galleries/';

router.get('/', (req, res, next) => {
    Gallery.find()
        .select("_id name description")
        .exec()
        .then(docs => {
            const result = {
                count: docs.count,
                galleries: docs.map(gallery => {
                    return {
                        _id: gallery.id,
                        name: gallery.name,
                        description: gallery.description,
                        request: {
                            type: 'GET',
                            url: GALLERY_API_URL + gallery.id
                        }
                    }
                })
            }
            res.status(200).json(result);
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        })
    
});

router.get('/:galleryId', (req, res, next) => {
    const id = req.params.galleryId;
    Gallery.findById(id)
    .select('_id name description')
    .exec()
    .then(doc => {
        if(doc) {
            const result = {
                gallery: {
                    _id: doc.id,
                    name: doc.name,
                    description: doc.description,
                    request: {
                        type: 'GET',
                        url: GALLERY_API_URL
                    }
                },
            };
            res.status(200).json(result);
        } else {
            res.status(404).json({
                message: 'Gallery not found'
            });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
});

router.post('/', (req, res, next) => {
    const gallery = new Gallery({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });

    gallery
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Create new gallery API",
                createdGallery: gallery
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        })
});

router.patch('/:galleryId', (req, res, next) => {
    const id = req.params.galleryId;
    let updateOps = {};
    for(const ops of req.body) {
        console.log("test", ops);
        updateOps[ops.propertyName] = ops.value;
    }

    // res.status(200).json(req.body);
    
    Gallery.update({_id: id}, updateOps)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Gallery updated successfully',
                request: {
                    type: 'GET',
                    url: GALLERY_API_URL + id
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
});

router.delete('/:galleryId', (req, res, next) => {
    const id = req.params.galleryId;
    Gallery.remove({
        _id: id
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Gallery deleted successfully",
            galleryId: req.params.galleryId
        });
    })
    .catch(error => {
        res.status(500).json({
            message: error.message
        });
    })
});

module.exports = router;