const express = require('express');
const upload = require('../util/multerInstance');
const Photo = require('../models/Photos');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res, next) {
    Photo.find({}, function(err, photos) {
        if(err) return next (err);
        res.render('photos', {
            title: 'Photos',
            photos: photos,
        });
    });
});

router.get('/upload', function (req, res, next) {
    res.render('photos/upload', {
        title: 'Photo upload',
    });
});

router.post('/upload', upload.single('photo[img]'), function (req, res, next) {
    if(typeof req.file.path !== 'undefined') {
        Photo.create({
            name: req.body.photo.name,
            path: req.file.filename,
        }, function (err) {
            if(err) return next(err);
            res.redirect('/photos');
        });
    }
});

router.get('/:id/download', function (req, res, next) {
    Photo.findById(req.params.id, function (err, photo) {
        if(err) return next(err);
        const filePath = path.join(req.app.get('photos'), photo.path);
        const fileNameToSave = photo.name + path.extname(photo.path);
        res.download(filePath, fileNameToSave, function (err) {
            if(err) return next(err);
        });
    });
});

module.exports = router;