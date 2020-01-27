import User from '../models/user.model';
import Role from '../models/role.model';

var jwt = require('jsonwebtoken');
import config from '../../config/config.json';
export default (app, router, auth, logger) => {
    router.route('/user')
        .get((req, res, next) => {
            return getUsers(req, res);
        });

    router.route('/user/:user_id')
        .get((req, res) => {
            var res_data = new Object();
            User.findOne({ "_id": req.params.user_id })
                .exec()
                .then(user => {
                    res_data.user = user;
                    return Role.find()
                })
                .then(roles => {
                    res_data.roles = roles;
                    res.json(res_data);
                })
                .catch(err => {
                    res.send(err);
                })
        })

        .put((req, res) => {
            User.findOne({ '_id': req.params.user_id }, (err, user) => {
                if (err)
                    res.send(err);

                if (req.body._id) {
                    user.first_name = req.body.first_name,
                        user.last_name = req.body.last_name,
                        user.address = req.body.address,
                        user.mobile_number = req.body.mobile_number,
                        user.role = req.body.role,
                        user.is_enabled = req.body.is_enabled

                    return user.save((err) => {
                        if (err)
                            res.send(err);
                        return res.send(user);
                    });
                }
                else {
                    return res.json({ message: "User not found" })
                }

            })
        })

        .delete((req, res) => {
            User.remove({ _id: req.params.user_id }, (err) => {
                if (err)
                    res.send(err);
                else
                    return getUsers(req, res);
            });
        });


    function getUsers(req, res) {
        User.find()
            .populate({ path: 'role', select: 'name' })
            .exec((err, users) => {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(users);
                }
            });
    }
}
