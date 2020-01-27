import Role from '../models/role.model';
import User from '../models/user.model';
export default (app, router, auth, logger) => {

    router.route('/role')
        .get((req, res) => {
            getRoles()
                .then(restRoles => {
                    res.json(restRoles);
                })
                .catch(err => {
                    res.send(err);
                })
        })

        .post((req, res) => {
            Role.create({
                name: req.body.name,
                description: req.body.description,
                is_enabled: req.body.is_enabled,
                menu: req.body.menu,
                full_generation: req.body.full_generation,
                created_at: new Date(),
                updated_at: new Date(),
                created_by: req.user._id,
                updated_by: req.user._id
            }, (err, role) => {
                if (err)
                    res.send(err);
                res.json(role);
            });
        })


    router.route('/role/:role_id')
        .get((req, res) => {
            Role.findOne({ '_id': req.params.role_id })
                .populate({ path: 'menu._id', select: 'name path ' })
                .then((role) => {
                    let viewRole = {
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
                    };
                    res.json(viewRole);
                })
        })


        .put(auth, (req, res) => {
            Role.findOne({
                '_id': req.params.role_id
            }, (err, role) => {
                if (err)
                    res.send(err);
                if (req.body._id) {
                    role.name = req.body.name;
                    role.menu = req.body.menu;
                    role.full_generation = req.body.full_generation;
                    role.description = req.body.description;
                    role.is_enabled = req.body.is_enabled;
                    role.updated_by = req.user._id;
                    role.updated_at = new Date();
                }
                return role.save((err) => {
                    if (err)
                        res.send(err);
                    return res.send(role);
                });
            })
        })

        .delete((req, res) => {
            deleteUserRefOfThisRole(req.params.role_id)
                .then(result => {
                    return Role.remove({ _id: req.params.role_id })
                })
                .then(role => {
                    return getRoles()
                })
                .then(restRoles => {
                    res.json(restRoles);
                })
                .catch(err => {
                    res.send(err);
                })
        });

    function getRoles() {
        return new Promise((resolve, reject) => {
            Role.find()
                .exec((err, roles) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(roles);
                    }
                });
        });
    }

    function deleteUserRefOfThisRole(roleId) {
        return new Promise((resolve, reject) => {
            User.remove({ role: roleId }, (err) => {
                if (err)
                    reject(err);
                else
                    resolve({});
            });
        });
    }
}