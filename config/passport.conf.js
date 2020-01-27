
import LocalStrategy from 'passport-local';

var jwt = require('jsonwebtoken');
import User from '../app/models/user.model.js';
import Role from '../app/models/role.model.js';
import config from './config.json'

export default (passport) => {

    let bounds = {

        username: {

            minLength: 3,

            maxLength: 16
        },

        password: {

            minLength: 4,

            maxLength: 128
        },

        email: {

            minLength: 5,

            maxLength: 256
        }
    };

    let validateEmail = (email) => {

        let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        return re.test(email);
    };
    let checkLength = (string, min, max) => {
        if (string.length > max || string.length < min)
            return false;

        else
            return true;
    };

    passport.serializeUser((user, done) => {

        let sessionUser = {

            _id: user._id,

            username: user.username,

            role: user.role
        };

        done(null, sessionUser);
    });

    passport.deserializeUser((sessionUser, done) => {
        done(null, sessionUser);
    });
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',

        passwordField: 'password',
        passReqToCallback: true
    },

        (req, username, password, done, ) => {
            if (!checkLength(username, bounds.username.minLength, bounds.username.maxLength)) {
                return done(null,
                    false,
                    { signupMessage: 'Invalid username length.' }
                );
            }

            if (!checkLength(password, bounds.password.minLength, bounds.password.maxLength)) {
                return done(null,
                    false,
                    { signupMessage: 'Invalid password length.' }
                );
            }

            if (!checkLength(req.body.email, bounds.email.minLength, bounds.email.maxLength)) {

                return done(null,
                    false,
                    { signupMessage: 'Invalid email length.' }
                );
            }
            if (!validateEmail(req.body.email)) {
                return done(null,
                    false,
                    { signupMessage: 'Invalid email address.' }
                );
            }
            process.nextTick(() => {
                User.findOne({
                    $or: [
                        { 'username': username },
                        { 'email': req.body.email }
                    ]
                }, (err, user) => {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null,

                            false,
                            {
                                signupMessage: 'That username/email is already taken.'
                            }
                        );

                    } else {
                        let newUser = new User();
                        newUser.local.username = username.toLowerCase();
                        newUser.local.email = req.body.email.toLowerCase();
                        newUser.role = req.body.role;
                        newUser.first_name = req.body.first_name;
                        newUser.last_name = req.body.last_name;
                        newUser.is_enabled = req.body.is_enabled;
                        newUser.mobile_number = req.body.mobile_number;
                        newUser.address = req.body.address;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save((err) => {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },

        (req, username, password, done) => {
            if (!checkLength(username, bounds.username.minLength, bounds.email.maxLength)) {
                return done(null,
                    false,

                    { loginMessage: 'Invalid username/email length.' }
                );
            }
            if (!checkLength(password, bounds.password.minLength, bounds.password.maxLength)) {
                return done(null,

                    false,

                    { loginMessage: 'Invalid password length.' }
                );
            }

            User.findOne({

                $or: [
                    { 'local.username': username.toLowerCase() },
                    { 'local.email': username.toLowerCase() }
                ]
            }, (err, user) => {

                if (err)
                    return done(err);
                if (!user) {

                    return done(null, false, {
                        loginMessage: 'That user was not found. ' +
                        'Please enter valid user credentials.'
                    }
                    );
                }

                if (!user.validPassword(password)) {

                    return done(null, false, { loginMessage: 'Invalid password entered.' });
                }

                Role.findOne({ _id: user.role })
                    .populate({ path: 'full_generation' })
                    .populate({ path: 'menu._id', select: 'name path ' })
                    .then((role) => {
                        if (err) {
                            return done(null, false, { loginMessage: 'No role is assigned' })
                        } else {
                            let newUserObject = {
                                _id: user._id,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                local: {
                                    email: user.local.email,
                                    password: user.local.password,
                                    username: user.local.username,
                                },

                                role: {
                                    _id: role._id,
                                    created_at: role.created_at,
                                    full_generation: role.full_generation,
                                    name: role.name,
                                    updated_at: role.updated_at,
                                    menu: role.menu.map(mnu => {
                                        return {
                                            _id: mnu._id._id,
                                            name: mnu._id.name,
                                            path: mnu._id.path,
                                            permissions: mnu.permissions
                                        }
                                    })
                                }
                            };
                            return done(null, newUserObject);
                        }
                    })
            });
        }));
}



