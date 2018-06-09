import { Injectable } from '@angular/core';
import {APISuccessResponse, GlobalsService} from "../../../globals.service";
import {Subject} from "rxjs/Subject";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable()
export class ChangePasswordService {

  reply: Subject<any> = new Subject<any>();

  constructor(
    private globals: GlobalsService,
    private http: HttpClient
  ) { }

  /**
   * Change the password by calling the API endpoint
   * @param {string} oldPassword
   * @param {string} newPassword
   */
  doIt(oldPassword: string, newPassword: string) {

    let endpoint = this.globals.endpoints.changePassword
      .replace('{profile_token}', this.globals.accountProfileToken);

    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer '+this.globals.authToken);
    let params = new HttpParams()
      .set('device_type', 'web');

    let body = {
      oldpassword: oldPassword,
      password: newPassword
    };

    this.http.put<APISuccessResponse>(endpoint, body, {headers: headers, params: params})
      .toPromise()
      .then(res => {
          this.reply.next(res);
        }
      )
      .catch(error => {
        this.reply.next(error);
      });
  }
}
