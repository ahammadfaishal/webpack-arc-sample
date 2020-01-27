import { Injectable } from '@angular/core'
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { UserManagementStore } from './pages/user-management/user-management.store';

@Injectable()
export class AuthManager extends UserManagementStore implements CanActivate {
    menu_permission: any = [];
    constructor(private router: Router) {
        super();
        this.menu_permission = JSON.parse(window.localStorage.getItem('menu_permission'));
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let key = window.localStorage.getItem('auth_key');
        let urls = state.url.split('/');
        let last_segment = urls[urls.length - 1];
        let values = this.allPermissionValue;
        let current_permission: string;
        let last_path: string;
        
        if (last_segment.length == 24) {
            current_permission = urls[urls.length - 2];
            last_path = urls[urls.length - 3];
        } else if (values.indexOf(last_segment) > -1) {
            current_permission = last_segment;
            last_path = urls[urls.length - 2];
        } else {
            current_permission = "view";
            last_path = last_segment;
        }

        let isPermitted = this.hasPermission(last_path, current_permission)
        if (key != undefined && isPermitted)
            return true;

        this.router.navigateByUrl('/login');

        return false;
    }

    hasPermission(last_path, permission) {
        let visiting_menu = this.menu_permission.filter(obj => {
            return obj.path == last_path;
        });
        if (visiting_menu.length > 0) {
            let permited_operations = visiting_menu[0].permissions.map(obj => {
                if (obj.status) {
                    return obj.value;
                }
            })
            if (permited_operations.indexOf(permission) > -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    get canAdd() {
        let urls = this.router.url.split('/');
        let last_segment = urls[urls.length - 1];
        let visiting_menu = this.menu_permission.filter(obj => {
            return obj.path == last_segment;
        });
        if (visiting_menu.length > 0) {
            let permited_operations = visiting_menu[0].permissions.map(obj => {
                if (obj.status) {
                    return obj.value;
                }
            })
            if (permited_operations.indexOf('add') > -1) {
        return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    get canEdit() {
        let urls = this.router.url.split('/');
        let last_segment = urls[urls.length - 1];
        let visiting_menu = this.menu_permission.filter(obj => {
            return obj.path == last_segment;
        });
        if (visiting_menu.length > 0) {
            let permited_operations = visiting_menu[0].permissions.map(obj => {
                if (obj.status) {
                    return obj.value;
                }
            })
            if (permited_operations.indexOf('edit') > -1) {
        return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    get canDelete() {
        let urls = this.router.url.split('/');
        let last_segment = urls[urls.length - 1];
        let visiting_menu = this.menu_permission.filter(obj => {
            return obj.path == last_segment;
        });
        if (visiting_menu.length > 0) {
            let permited_operations = visiting_menu[0].permissions.map(obj => {
                if (obj.status) {
                    return obj.value;
                }
            })
            if (permited_operations.indexOf('delete') > -1) {
        return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}





















































































// let permited_resources = JSON.parse(window.localStorage.getItem('menu')).children;
//         if (reqUrl.root) {
//             let rootResult = permited_resources.filter(rt => {
//                 if (reqUrl.root == rt.path) {
//                     return rt;
//                 }
//             })
//             if (rootResult.length > 0) {
//                 if (reqUrl.child && rootResult[0].children) {
//                     let childResult = rootResult[0].children.filter(chld => {
//                         if (reqUrl.child == chld.path) {
//                             return chld;
//                         };
//                     })
//                     if (childResult.length > 0) {
//                         if (reqUrl.grand && childResult[0].children) {
//                             let grandResult = childResult[0].children.filter(grnd => {
//                                 if (reqUrl.grand === grnd.path) {
//                                     return grnd;
//                                 };
//                             })
//                             if (grandResult.length > 0 && !reqUrl.others) {
//                                 return true
//                             } else if (grandResult.length > 0 && reqUrl.others) {
//                                 if (reqUrl.others.length == 24) {
//                                     if (grandResult[0].permission.update) {
//                                         return true;
//                                     } else {
//                                         return false;
//                                     }
//                                 } else {
//                                     if (grandResult[0].permission[reqUrl.others]) {
//                                         return true;
//                                     } else {
//                                         return false;
//                                     }
//                                 }
//                             } else {
//                                 return false;
//                             }
//                         } else if (reqUrl.grand && reqUrl.grand == 'edit' && !childResult[0].children) {
//                             if (childResult[0].permission.update) {
//                                 return true;
//                             } else {
//                                 return false;
//                             }
//                             // return true;
//                         }
//                         else if (!reqUrl.grand && !childResult[0].children) {
//                             return true;
//                         } else if (!childResult[0].children && ["view", "add", "update", "delete"].indexOf(reqUrl.grand) != -1) {
//                             if (childResult[0].permission[reqUrl.grand]) {
//                                 return true;
//                             } else {
//                                 return false;
//                             }
//                         } else {
//                             return false;
//                         }
//                     } else {
//                         return false;
//                     }

//                 } else if (!reqUrl.child && !rootResult[0].children) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             } else {
//                 return false;
//             }
//         } else {
//             return false;
//         }