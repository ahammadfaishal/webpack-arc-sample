
import { validateEnvVariables } from './config/env.conf.js';
validateEnvVariables();
import config from './config/config.json';
import express from 'express';
import socketio from 'socket.io';
import http from 'http';
let app = express();
let server = http.createServer(app);
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';

let port = process.env.PORT || 8080;
import mongooseConf from './config/mongoose.conf.js';
mongoose.Promise = global.Promise;
mongooseConf(mongoose);
import passportConf from './config/passport.conf.js';
passportConf(passport);
if (process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'test')
  // Log every request to the console
  app.use(morgan('dev'));

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/dist'));
app.use(session({

  secret: process.env.SESSION_SECRET,

  resave: true,

  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
let router = express.Router();
import routes from './app/routes';
routes(app, router, passport);
server.listen(port);
console.log(`Wizardry is afoot on port ${port}`);

export { app };
