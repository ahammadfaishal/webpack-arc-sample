import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
@Injectable()
export class DashboardService {
    headers;
    constructor(private http: Http) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
}
