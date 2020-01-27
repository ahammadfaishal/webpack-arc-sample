import Menu from './app/models/menu.model';
import Role from './app/models/role.model';
import User from './app/models/user.model';
var mongoose = require('mongoose');
const chalk = require('chalk');
const log = console.log;

var database_name = process.argv[2] ? process.argv[2] : process.env.database;
var username = process.argv[3] ? process.argv[3] : process.env.username;
var password = process.argv[4] ? process.argv[4] : process.env.password;

if (process.argv.length == 5 || (database_name && username && password)) {
    if (password.length < 6) {
        log(chalk.red("Admin seed failed"));
        log(chalk.red("Error: Invalid password length"));
        log(chalk.blue.bgBlack.bold("Password length should be at least 6"));
    } else {
        var db = mongoose.connect('mongodb://127.0.0.1:27017/' + database_name, (err) => {
            if (err) {
                log(chalk.red("Admin seed failed"));
                log(chalk.blue.bgBlack.bold("Can not connect with mongodb. Please ensure Mongodb installed properly in you system"));
            } else {
                log(chalk.green.underline.bold("Connected with database"));
                dropCollections().then(collection => {
                    return saveMenus();
                })
                    .then(savedMenu => {
                        log(chalk.green.underline.bold("Menu Crated"));
                        return saveRole();
                    })
                    .then(role => {
                        log(chalk.green.underline.bold("Role created"));
                        return saveUser(role);
                    })
                    .then(user => {
                        log(chalk.green.underline.bold("User saved and assigned admin role"));
                        // console.log(user);
                        disconnectDatabase();
                    })
                    .catch(err => {
                        log(err);
                    });
            }
        });
    }

} else {
    log(chalk.red("Admin seed failed"));
    log(chalk.red("Error: Required parameters not supplied"));
    log(chalk.blue.bgBlack.bold("Please run : "
        + "npm run seed [database name] [username] [password(6 character length)]")
    );
    log(chalk.white.bgGreen.bold("Example: npm run seed testdb admin 123456"))
}


function saveUser(role) {
    return new Promise((resolve, reject) => {
        var newUser = new User();
        newUser.local = {
            username: username,
            password: newUser.generateHash(password)
        };
        newUser.first_name = "First Name";
        newUser.last_name = "Last Name";
        newUser.role = role._id;
        newUser.save(err => {
            if (!err) {
                resolve(newUser);
            } else {
                log(err);
                reject(err);
            }
        })
    })
}

function saveMenus() {
    var allMenu = getPages().map(menu => {
        return new Promise((resolve, reject) => {
            var newMenu = new Menu();
            newMenu._id = menu._id;
            newMenu.position = menu.position;
            newMenu.parent = menu.parent;
            newMenu.path = menu.path;
            newMenu.name = menu.name;
            newMenu.is_enabled = menu.is_enabled;
            newMenu.updated_at = menu.updated_at;
            newMenu.created_at = menu.created_at;
            newMenu.data = menu.data;
            newMenu.permissions = menu.permissions;
            newMenu.save(err => {
                if (err) {
                    log(err);
                    reject({ status: "Rejected" });
                } else {
                    resolve({ status: "Success" });
                }
            })
        })
    })
    return Promise.all(allMenu);
}

function saveRole() {
    var role = getRole();
    return new Promise((resolve, reject) => {
        var newRole = new Role();
        newRole._id = role._id;
        newRole.name = role.name;
        newRole.is_enabled = role.is_enabled;
        newRole.full_generation = role.full_generation;
        newRole.menu = role.menu;
        newRole.save(err => {
            if (!err) {
                resolve(newRole);
            } else {
                console.log(err);
                reject(err);
            }
        })
    })
}

function getPages() {
    let menus = [
        {
            _id: "58f5d2dfc009fa3abd7fc010",
            "position": 1,
            "path": "pages",
            "name": "Pages",
            "is_enabled": true,
            "updated_at": new Date(),
            "created_at": new Date(),
            "data": {
                "menu": {
                    "selected": false,
                    "expanded": false,
                    "title": "Pages",
                    "icon": "ion-grid"
                }
            },
            "permissions": []
        },
        {
            "_id": "58ff29fdfd548908a9bb62da",
            "position": 2,
            "is_enabled": true,
            "name": "Dashboard",
            "parent": "58f5d2dfc009fa3abd7fc010",
            "path": "dashboard",
            "updated_at": new Date(),
            "created_at": new Date(),
            "data": {
                "menu": {
                    "selected": false,
                    "expanded": false,
                    "title": "Dashboard",
                    "icon": "ion-android-home"
                }
            },
            "permissions": [
                {
                    "name": "View",
                    "value": "view",
                    "status": false
                }
            ],
        },
        {
            "_id": "58ff2ac8fd548908a9bb62dc",
            "position": 3,
            "is_enabled": true,
            "name": "User Management",
            "parent": "58f5d2dfc009fa3abd7fc010",
            "path": "user-management",
            "updated_at": new Date(),
            "created_at": new Date(),
            "data": {
                "menu": {
                    "selected": false,
                    "expanded": false,
                    "title": "User Management",
                    "icon": "ion-grid"
                }
            },
            "permissions": [],
        },

        {
            "_id": "58ff2b62fd548908a9bb62e0",
            "is_enabled": true,
            "position": 4,
            "name": "Roles",
            "parent": "58ff2ac8fd548908a9bb62dc",
            "path": "roles",
            "updated_at": new Date(),
            "created_at": new Date(),
            "data": {
                "menu": {
                    "selected": false,
                    "expanded": false,
                    "title": "Roles"
                }
            },
            "permissions": [
                {
                    "status": false,
                    "value": "view",
                    "name": "View"
                },
                {
                    "status": false,
                    "value": "add",
                    "name": "Add"
                },
                {
                    "status": false,
                    "value": "edit",
                    "name": "Edit"
                },
                {
                    "status": false,
                    "value": "delete",
                    "name": "Delete"
                }
            ]
        },

        {
            "_id": "58ff2b79fd548908a9bb62e1",
            "position": 5,
            "is_enabled": true,
            "name": "Users",
            "parent": "58ff2ac8fd548908a9bb62dc",
            "path": "users",
            "updated_at": new Date(),
            "created_at": new Date(),
            "data": {
                "menu": {
                    "selected": false,
                    "expanded": false,
                    "title": "Users"
                }
            },
            "permissions": [
                {
                    "status": false,
                    "value": "view",
                    "name": "View"
                },
                {
                    "status": false,
                    "value": "add",
                    "name": "Add"
                },
                {
                    "status": false,
                    "value": "edit",
                    "name": "Edit"
                },
                {
                    "status": false,
                    "value": "delete",
                    "name": "Delete"
                },
                {
                    "status": false,
                    "value": "changepass",
                    "name": "Changepass"
                }
            ]
        },
        {
            "_id": "58ff3e4edc680b1b255f7513",
            "position": 6,
            "is_enabled": true,
            "name": "Menus",
            "parent": "58ff2ac8fd548908a9bb62dc",
            "path": "menus",
            "data": {
                "menu": {
                    "selected": false,
                    "expanded": false,
                    "title": "Menus"
                }
            },
            "permissions": [
                {
                    "status": false,
                    "value": "view",
                    "name": "View"
                },
                {
                    "status": false,
                    "value": "add",
                    "name": "Add"
                },
                {
                    "status": false,
                    "value": "edit",
                    "name": "Edit"
                },
                {
                    "status": false,
                    "value": "delete",
                    "name": "Delete"
                }
            ]
        }
    ]
    return menus;
}

function getRole() {
    var role_data = {
        _id: "594d62005bfb9d091d0ce986",
        name: "Development",
        is_enabled: true,
        full_generation: [
            "58ff29fdfd548908a9bb62da",
            "58f5d2dfc009fa3abd7fc010",
            "58ff2b62fd548908a9bb62e0",
            "58ff2ac8fd548908a9bb62dc",
            "58ff2b79fd548908a9bb62e1",
            "58ff3e4edc680b1b255f7513"
        ],
        menu: [
            {
                "_id": "58ff29fdfd548908a9bb62da",
                //"name": "Dashboard",
                //"path": "dashboard",
                "permissions": [
                    {
                        "name": "View",
                        "value": "view",
                        "status": true,
                        "_id": "594d62005bfb9d091d0ce994"
                    }
                ]
            },
            {
                "_id": "58ff2b62fd548908a9bb62e0",
                //"name": "Roles",
                //"path": "roles",
                "permissions": [
                    {
                        "status": true,
                        "value": "view",
                        "name": "View",
                        "_id": "594d62005bfb9d091d0ce993"
                    },
                    {
                        "status": true,
                        "value": "add",
                        "name": "Add",
                        "_id": "594d62005bfb9d091d0ce992"
                    },
                    {
                        "status": true,
                        "value": "edit",
                        "name": "Edit",
                        "_id": "594d62005bfb9d091d0ce991"
                    },
                    {
                        "status": true,
                        "value": "delete",
                        "name": "Delete",
                        "_id": "594d62005bfb9d091d0ce990"
                    }
                ]
            },
            {
                "_id": "58ff2b79fd548908a9bb62e1",
                //"name": "Users",
                //"path": "users",
                "permissions": [
                    {
                        "status": true,
                        "value": "view",
                        "name": "View",
                        "_id": "594d62005bfb9d091d0ce98f"
                    },
                    {
                        "status": true,
                        "value": "add",
                        "name": "Add",
                        "_id": "594d62005bfb9d091d0ce98e"
                    },
                    {
                        "status": true,
                        "value": "edit",
                        "name": "Edit",
                        "_id": "594d62005bfb9d091d0ce98d"
                    },
                    {
                        "status": true,
                        "value": "delete",
                        "name": "Delete",
                        "_id": "594d62005bfb9d091d0ce98c"
                    },
                    {
                        "status": true,
                        "value": "changepass",
                        "name": "Changepass",
                        "_id": "594d62005bfb9d091d0ce98b"
                    }
                ]
            },
            {
                "_id": "58ff3e4edc680b1b255f7513",
                //"name": "Menus",
                //"path": "menus",
                "permissions": [
                    {
                        "status": true,
                        "value": "view",
                        "name": "View",
                        "_id": "594d62005bfb9d091d0ce98a"
                    },
                    {
                        "status": true,
                        "value": "add",
                        "name": "Add",
                        "_id": "594d62005bfb9d091d0ce989"
                    },
                    {
                        "status": true,
                        "value": "edit",
                        "name": "Edit",
                        "_id": "594d62005bfb9d091d0ce988"
                    },
                    {
                        "status": true,
                        "value": "delete",
                        "name": "Delete",
                        "_id": "594d62005bfb9d091d0ce987"
                    }
                ]
            }
        ]
    }
    return role_data;
}

function dropCollections() {
    return new Promise((resolve, reject) => {
        mongoose.connection.collections['menus'].drop(function (err) {
            if (err)
                log("");
            else
                log(chalk.yellow("Exist Menu collection droped"));

            mongoose.connection.collections['roles'].drop(function (err) {
                if (err)
                    log("");
                else
                    log(chalk.yellow("Exist Roles collection droped"));

                mongoose.connection.collections['users'].drop(function (err) {
                    if (err)
                        log("");
                    else
                        log(chalk.yellow("Exist Users collection droped"));

                    resolve({ status: 'all droped' });
                });
            });
        });
    })
}


function disconnectDatabase() {
    mongoose.connection.close(function () {
        log(chalk.blue.bold('Mongoose connection disconnected'));
    });
}

