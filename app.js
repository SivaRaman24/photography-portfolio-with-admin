const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const EventEmitter = require('events');

const galleryRoutes = require('./api/routes/gallery');

const DB_NAME = 'photography-portfolio';
const CONNECTION_URI = 'mongodb://127.0.0.1:27017/' + dbName;

mongoose
    .connect(CONNECTION_URI, { useNewUrlParser: true })
    .catch(error => {
        console.log("Database connection error", error);
    });

const mongoDbEmitter = new EventEmitter();
mongoDbEmitter.on('connected', (event) => {
    console.log("Database connected", event);
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//TODO: Needs to check about this because of api is not working in PostMan
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, x-requested-with, Content-Type, Accept, Authorization'
//     );

//     if(req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methoda', 'POST, PUT, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
// });

app.use('/galleries', galleryRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    console.log('not found');
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    console.log("next working");
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;