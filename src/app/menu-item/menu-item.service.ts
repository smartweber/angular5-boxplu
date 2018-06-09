import { Injectable } from '@angular/core';
import {APIDataResponse, GlobalsService} from '../globals.service';
//import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Subject} from "rxjs/Subject";

@Injectable()
export class MenuItemService {

  public menuItem: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private globals: GlobalsService
  ) {}

  getMenuItemById(optionId: string) {
    //API path
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);

    //API query
    let params = new HttpParams()
      .set('device_type', 'web')
      .set('device_layout', 'web');

    //API path
    let endpoint = this.globals.endpoints.menuOption
      .replace('{menu_id}',this.globals.menuId)
      .replace('{option_id}', optionId);

    return this.http.get<APIDataResponse>(endpoint, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.menuItem.next(res.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

}
