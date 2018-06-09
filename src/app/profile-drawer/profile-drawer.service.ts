import {Injectable} from '@angular/core';

import {APIDataResponse, GlobalsService} from '../globals.service';

import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Profile} from "./Profile";
import 'rxjs/add/operator/map';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import swal from "sweetalert2";

@Injectable()
export class ProfileDrawerService {

  // Subjects available to all subscribers
  // @Notes: BehaviourSubject was chosen because of the availability of the method getValue() ;)
  visible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private globals: GlobalsService,
    private http: HttpClient
  ) { }

  /**
   * Toggle the visibility of the profiles drawer, by emitting a new value to all subscribers
   */
  toggle() {
    this.visible.next(!this.visible.getValue());
  }

  /**
   * Get all the profiles for a user account
   */
  readAllProfiles() {
    // Emit a loading profiles status to all subscribers
    this.loading.next(true);
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer '+this.globals.authToken);
    let params = new HttpParams()
      .set('device_type', 'web');

    let endpoint = this.globals.endpoints.profiles.replace('{account_token}', this.globals.accountToken);

    this.http.get<APIDataResponse>(endpoint, {headers: headers, params: params})
      .toPromise()
      .then( res => {
        this.globals.userProfiles = res.data;
        this.loading.next(false);
      })
      .catch(function (error) {
        console.error(error);
        this.loading.next(false);
      });
  }

  /**
   * Read the details for a given profile token and make it the current profile in the globals section
   * @param {string} token
   */
  readProfileDetails(token: string) {
    let headers = new HttpHeaders()
      .set('Authorization', 'bearer '+this.globals.authToken);
    let params = new HttpParams()
      .set('device_type', 'web');

    this.http.get<APIDataResponse>(this.globals.endpoints.profile + token, {headers: headers, params: params})
      .toPromise()
      .then(
        res => {
          console.log("Profile init()");
          this.globals.currProfile = res.data;
        }
      )
      .catch(function (error) {
        console.error(error);
      });
  }

  /**
   * Create or update a profile
   * @param {Profile} newProfile
   * @returns {Observable<any>}
   */
  // TODO: NOT WORKING YET. REWRITE THIS CODE!
  createUpdateProfile(profile: Profile)  {
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer '+this.globals.authToken);
    return this.http.post(this.globals.endpoints.profiles, JSON.stringify(profile.toJS()), {headers});
  }

  /**
   * Delete a profile
   * @param {id} string
   */
  deleteProfile(id: string) {
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer '+this.globals.authToken);

    let params = new HttpParams()
      .set('profile_id', id)
      .set('device_type', 'web');

    let endpoint = this.globals.endpoints.profiles.replace('{account_token}', this.globals.accountToken);
    this.http.delete<APIDataResponse>(endpoint, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        swal({
            type: 'success',
            background: '#2a292a',
            html: '<span style="color: #fff;">'+res.data.description+'</span>'
          }
        );
        // Update the list of profiles
        this.readAllProfiles();
      })
      .catch(function (error) {
        console.error(error);
        swal({
            type: 'error',
            html:'<span style="color: #fff;">'+error.description+'</span>',
            background: '#2a292a'
          }
        );
      });
  }

}
