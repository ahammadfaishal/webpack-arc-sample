import authRoutes from './routes/_authentication.router.js';
import config from '../config/config.json';
import roleRoutes from './routes/_role.router.js';
import userRoutes from './routes/_user.router.js';
import menuRoutes from './routes/_menu.router.js';
import log4js from 'log4js';

import multer from 'multer';
import cors from 'cors';
import express from 'express';
var jwt = require('jsonwebtoken');


export default (app, router, passport) => {


    router.use((req, res, next) => {
        next();
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.send({ staus: 420 });
    }


    let auth = (req, res, next) => {
        let token = req.cookies.token;
        jwt.verify(token, config.SESSION_SECRET, function (err, decoded) {
            if (err) {
                res.json({ success: false, message: 'Please login first' });
            } else {
                let user = decoded;
                req.user = user;
                next();
            }
        })
    };

    let logger = function (log_for) {
        return (req, res, next) => {
            let file_name = 'logs/' + log_for + '.log';
            log4js.configure({
                appenders: {
                    everything: { type: 'dateFile', filename: file_name, pattern: '.yyyy-MM-dd-hh', compress: false }
                },
                categories: {
                    default: { appenders: ['everything'], level: 'debug' }
                }
            });
            req.log = log4js.getLogger(log_for);
            next();
        }
    }

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    const path = require('path');
    app.use(cors());

    const upload = multer({
        storage: multer.diskStorage({
            destination: 'uploads/member/',
            filename: (req, file, cb) => {
                let ext = path.extname(file.originalname);
                cb(null, `${req.query.id}${ext}`)
            }
        })
    });

    app.post('/upload', upload.any(), (req, res) => {

        res.json(req.files.map(file => {
            let ext = path.extname(file.originalname);
            return {
                originalName: file.originalname,
                filename: file.filename
            }
        }));
    });

    authRoutes(app, router, passport, auth);
    roleRoutes(app, router, auth, logger);
    userRoutes(app, router, auth, logger);
    menuRoutes(app, router, auth, logger);

    app.use('/api', router);


    app.get('*', (req, res) => {
        res.sendFile('/dist/index.html', { root: __dirname + "/../" });
    });

};
