import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AppState } from "../../app.service";
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
}) 
export class Dashboard {
  constructor(private router: Router, private dashboardService: DashboardService) {
    // this.appState.isLoggedIn().subscribe((res)=>{
    //     if(res.status==400){
    //     }else{
    //       this.router.navigateByUrl('/login');
    //     }
    //   })
  }
  ngOnInit() {
    let urle = this.router.url;
    console.log(urle);
  }

}
