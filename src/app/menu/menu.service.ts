import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {APIDataResponse, GlobalsService} from '../globals.service';
import {Menu} from './menu';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';
import {Router} from "@angular/router";

@Injectable()
export class MenuService {


  public data: Subject<Menu> = new Subject<Menu>();
  //public windowSize: Subject<number> = new Subject<number>();

  constructor(
    private http: HttpClient,
    private globals: GlobalsService,
    private router: Router,
  ) {
    // will create a eventlistener for windows resizing events
    //document.addEventListener( eventname, eventhandler);
  }


  getDefaultMenu() {
    const headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);
    const params = new HttpParams()
      .set('device', 'web')
      .set('device_type', 'web')
      .set('device_layout', 'web');

    this.http.get<APIDataResponse>(this.globals.endpoints.menus, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        // The first menu on the menus list is the one we use
        this.globals.menuId = res.data[0].id;

        const headers = new HttpHeaders()
          .set('Accept-Language', this.globals.settings.default_language);
        const params = new HttpParams()
          .set('device', 'web')
          .set('device_type', 'web')
          .set('device_layout', 'web');

        // Then we get the menu items from that menu
        let endpoint = this.globals.API + 'menus/' + this.globals.menuId;
        this.http.get<APIDataResponse>(endpoint, {headers: headers, params: params})
          .toPromise()
          .then(
            res => {
                // And we assign the data we get back, with the menu items, to a global "menu" object
                this.globals.menu = res.data.options;
                this.data.next(res.data.options);

                // Navigate directly to the first menu option
                this.router.navigate([this.globals.menu[0].slug]);
            }
          )
          .catch(function (error) {
            console.error(error);
          });

      })
      .catch(function (error) {
        console.error(error);
      });
  }


}
