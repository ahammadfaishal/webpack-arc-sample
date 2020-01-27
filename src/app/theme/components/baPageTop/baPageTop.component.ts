import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { GlobalState } from '../../../global.state';
import { Router } from "@angular/router";
import { PageTopService } from "./baPageTop.service";
import { BaMenuService } from '../../services/baMenu';
import 'style-loader!./baPageTop.scss';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
})
export class BaPageTop {

  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = false;

  constructor(private _state: GlobalState, private router: Router, private pagetopService: PageTopService, private _menuService: BaMenuService) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  logOut() {
    this.pagetopService.loguot().subscribe((res) => {
      if (res.success) {
        window.localStorage.removeItem('auth_key');
        window.localStorage.removeItem('menu');
        window.localStorage.removeItem('menu_permission');
         this._menuService.updateMenuByRoutes(<Routes>[]);
        this.router.navigateByUrl('/login');
      }
    })
  }

}
