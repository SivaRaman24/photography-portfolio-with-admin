const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const shell = require('shelljs');

//Models
const Gallery = require('../models/gallery');
const GalleryImage = require('../models/galleryImage');

//Constant variables
//TODO: Needs to move this variables to environment variables
const API_URL = 'http://127.0.0.1:3000/';
const GALLERY_IMAGE_BASE_FOLDER = './assets/gallery/';
const FEATURE_IMAGE_BASE_FOLDER = './assets/gallery/featureImages/';
const GALLERY_IMAGE_BASE_URL = API_URL + 'assets/gallery/';
const FEATURE_IMAGE_BASE_URL = API_URL + 'assets/gallery/featureImages/';

const getGalleryObjFromReq = (req) => {
    const galleryObj = {
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        keywords: req.body.keywords,
        featureImageName: req.file.filename,
        bannerImageName: '',
        customUrl: req.body.customUrl,
        visibility: req.body.visibility,
        password:'',
        passwordHint:'',
        enableDownloadOption: req.body.enableDownloadOption,
        enableShoppingButton: req.body.enableShoppingButton,
        enableSharingOption: req.body.enableSharingOption,
        enableCommentSection: req.body.enableCommentSection,
        enableSlideShow: req.body.enableSlideShow,
        enableCameraInfo: req.body.enableCameraInfo,
        ancestors: req.body.ancestors,
        parent: req.body.parent,
    };
    
    if(galleryObj.visibility === 'PRIVATE') {
        galleryObj.password = req.body.password; //TODO: Needs to hash the password
        galleryObj.passwordHint = req.body.passwordHint;
    }

    return new Gallery(galleryObj);
};

const fileFilter = (req, file, callback) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        //Accepting a file
        callback(null /** error */, true);
    } else {
        //Rejecting a file
        callback(null /** error */, false);
    }
}

const handleFileUpload = (destination) => {
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, callback) => {
                const galleryId = req.params.galleryId;
                shell.mkdir('-p', destination + galleryId);
                callback(null /** error */, destination + galleryId /** destination */);
            },
            filename: (req, file, callback) => {
                callback(null /** error */, Date.now() + '_' + file.originalname  /** filename */);
            }
        }),
        fileFilter: fileFilter
    });
}

router.post('/', handleFileUpload(FEATURE_IMAGE_BASE_FOLDER).single('featureImage' /** fieldName */), (req, res, next) => {
    const gallery = getGalleryObjFromReq(req);
    gallery
        .save()
        .then(result => {
            res.status(201).json({
                message: "Create new gallery API",
                createdGallery: gallery,
                requestBody: req.body,
                featureImageFile: req.file, //For Reference
                featureImageUrl: FEATURE_IMAGE_BASE_URL + req.file.filename
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        })
});

const deleteUploadedImages = (fileNamesToDelete) => {
    shell.rm(fileNamesToDelete);
}

router.post('/:galleryId/upload/', 
    handleFileUpload(GALLERY_IMAGE_BASE_FOLDER).array('galleryImage' /** fieldName */), 
    (req, res, next) => {
        const galleryId = req.params.galleryId;
        const images = req.files;
        let galleryImages = [];
        let fileNames = [];
        images.forEach((image, index) => {
            galleryImage = {
                _id: new mongoose.Types.ObjectId(),
                name: image.filename,
                galleryId: galleryId
            };
            galleryImages.push(galleryImage);
            fileNames.push(image.path);
        });

        GalleryImage.create(galleryImages).then(result => {
            res.status(200).json({
                galleryImages: result.map((currentValue) => {
                    return {
                        _id: currentValue.id,
                        name: currentValue.name,
                        galleryId: currentValue.galleryId,
                        imageUrl: GALLERY_IMAGE_BASE_URL + currentValue.galleryId + '/' + currentValue.name
                    }
                }),
            });
        }).catch(error => {
            //Will delete uploaded files incase of any error
            deleteUploadedImages(fileNames);
            res.status(500).json({
                message: error.message
            });
        });
});

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


router.patch('/:galleryId', (req, res, next) => {
    const id = req.params.galleryId;
    let updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propertyName] = ops.value;
    }

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