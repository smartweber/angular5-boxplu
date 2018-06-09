import { Injectable } from '@angular/core';
import {APIDataResponse, APISuccessResponse, GlobalsService} from "../globals.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Subject} from "rxjs/Subject";
import {Session} from "../models/session";
import swal from "sweetalert2";
import {LoginService} from "../login/login.service";

@Injectable()
export class SessionsService {

  public sessions: Subject<Session[]> = new Subject<Session[]>();
  public finishedClosingSession: Subject<boolean> = new Subject<boolean>();
  public isVisible: Subject<boolean> = new Subject<boolean>();  // Serves to show/hide the list of sessions

  constructor(
    private http: HttpClient,
    private globals: GlobalsService,
    private login: LoginService
  ) { }


  /**
   * Get the live sessions for the current auth token
   */
  getLiveSessions(token: string) {
    // The temporary auth token was obtained from login when the max sessions was reached
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer '+token);

    // Account token already in path for the endpoint call
    let params = new HttpParams()
      .set('device_type', 'web');

    let endpoint = this.globals.endpoints.liveSessions.replace('{account_token}', this.globals.accountToken);

    this.http.get<APIDataResponse>(endpoint, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.sessions.next(res.data);

        // Clear the temporary auth token
        //this.globals.tempAuthToken = null;
      })
      .catch(error => {
        console.error(error);
        swal({
            type: 'error',
            title: '<span style="color: #fff;" class="title">' + this.globals.strings.SCREEN_ERROR_TITLE + '</span>',
            html:  '<span style="color: #fff;">' + this.globals.strings.GENERAL_ERROR + '</span>',
            background: '#2a292a'
          }
        );
      });
  }


  /**
   * Remove (free) a session by auth_token - mainly used when all the available sessions
   * have been used up
   * @param {string} auth_token
   */
  remove(auth_token: string) {
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer '+auth_token);

    let params = new HttpParams()
      .set('device_type', 'web');

    this.http.delete<APISuccessResponse>(this.globals.endpoints.logout, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.finishedClosingSession.next(true);

        if (this.globals.tempAuthToken!=null){
            this.removeTemporary();
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  removeTemporary() {
      let headers = new HttpHeaders()
          .set('Authorization', 'Bearer '+this.globals.tempAuthToken);

      let params = new HttpParams()
          .set('device_type', 'web');

      this.http.delete<APISuccessResponse>(this.globals.endpoints.logout, {headers: headers, params: params})
          .toPromise()
          .then(res => {
              this.login.provider_login("tvcable",this.globals.endpoints.socialLogin,this.globals.currUsername,this.globals.currPassword,null,null);
              this.globals.tempAuthToken=null;
          })
          .catch(function (error) {
              console.error(error);
          });

  }

  /**
   * Toggle the visibility of the user sessions
   */
  toggle() {
    this.isVisible.next(!this.isVisible);
  }
}
