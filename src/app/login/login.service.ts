import { Injectable } from '@angular/core';
import {
  APIDataResponse, APILoginSuccess, APIProviderLoginSuccess, APISuccessResponse,
  GlobalsService
} from '../globals.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Subject} from "rxjs/Subject";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable()
export class LoginService {

  public finishedLogin : Subject<boolean> = new Subject<boolean>();
  public finishedLogout: Subject<boolean> = new Subject<boolean>();
  public errorMsg : Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private globals: GlobalsService
  ) {
    // Initialize Subjects to default values
    this.finishedLogin.next(false);
    this.errorMsg.next(null);


  }

  /**
   * Login using providers
   * @Notes: first stage only tvcable, with regular username/password login
   *
   * @param {string} grant_type - type of social login (twitter_token/facebook_token/tvcable)
   * @param {string} auth_endpoint
   * @param {string} username
   * @param {string} password
   * @param {string} social_token
   * @param {string} token_secret - secret token need twitter login
   */
  provider_login(grant_type: string, auth_endpoint: string, username: string, password: string, social_token: string, token_secret: string ) {
    // check if a DUID is already in local storage. If not generate a new one and store it.
    var duid = localStorage.getItem(this.globals.localStorageKeyPrefix+'DUID');

    if (duid === '' || duid === null) {
      duid = this.generateDUID();
      localStorage.setItem(this.globals.localStorageKeyPrefix+'DUID', duid);
    }

    const headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);

    const body = {
      email: username,
      password: password,
      grant_type: grant_type,
      social_token: social_token,
      token_secret: token_secret,
      username: username,
      device_type: 'web',
      duid: duid
    };

    this.http.post<APIProviderLoginSuccess>(auth_endpoint, body, {headers: headers})
      .toPromise()
      .then( res => {
        this.globals.userLoggedIn = true;
        this.globals.accountToken = res.account_token;
        this.globals.authToken = res.auth_token;
        this.globals.authTokenExpiration = res.auth_expires;
        this.errorMsg = null;

          // Store the auth_token in local storage for future use (i.e. recover session after refresh or
          // auto-login between sessions)
          localStorage.setItem(this.globals.localStorageKeyPrefix+'AUTHTOKEN', res.auth_token);

          // Also store the account token (needed by a number of API calls)
          localStorage.setItem(this.globals.localStorageKeyPrefix+'ACCTOKEN', res.account_token);

        // Step 2: Get the profiles
        let headers = new HttpHeaders()
          .set('Accept-Language', this.globals.settings.default_language)
          .set('Authorization', 'bearer '+this.globals.authToken);
        let params = new HttpParams()
          .set('account_token', this.globals.accountToken)
          .set('device_type', 'web');

        let endpoint = this.globals.endpoints.profiles.replace('{account_token}', this.globals.accountToken);

        this.http.get<APIDataResponse>(endpoint, {headers: headers, params: params})
          .toPromise()
          .then(
            res => {
              this.globals.userProfiles = res.data;

              // Check if the user has already chosen a profile
              let currProfileToken = localStorage.getItem(this.globals.localStorageKeyPrefix+'CURRPROF');
              if (currProfileToken!=='' && currProfileToken!==null) {
                // Go through the profiles list and get the current one's token
                let found = false;
                this.globals.userProfiles.forEach((element) => {
                  if (element.token === currProfileToken) {
                    found = true;
                    this.globals.accountProfileToken = currProfileToken;
                    // Step 3: With the profile token get the user's details
                    this.getProfile(currProfileToken);
                  }
                });
                // No match was found for the profile token in local storage; default to first
                if (!found) {
                  currProfileToken = this.globals.userProfiles[0].token;
                  this.globals.accountProfileToken = currProfileToken;
                  // Store the 1st one as the current profile
                  localStorage.setItem(this.globals.localStorageKeyPrefix+'CURRPROF', currProfileToken);

                  // Step 3: With the profile token get the user's details
                  this.getProfile(currProfileToken);
                }
              }
              else {
                currProfileToken = this.globals.userProfiles[0].token;
                this.globals.accountProfileToken = currProfileToken;
                // Store the 1st one as the current profile
                localStorage.setItem(this.globals.localStorageKeyPrefix+'CURRPROF', currProfileToken);

                // Step 3: With the profile token get the user's details
                this.getProfile(currProfileToken);
              }

              // Emit finished login to close the login modal and perform other tasks
              this.finishedLogin.next(true);
            }
          )
          .catch(function (error) {
            console.error(error);
          });

      })
      .catch(result => {
        console.error(result);
        this.errorMsg.next(result);
      });

  }

  /**
   * Regular login using email and password
   */
  login(email: string, password: string) {

    // check if a DUID is already in local storage. If not generate a new one and store it.
    var duid = localStorage.getItem(this.globals.localStorageKeyPrefix+'DUID');

    if (duid === '' || duid === null) {
      duid = this.generateDUID();
      localStorage.setItem(this.globals.localStorageKeyPrefix+'DUID', duid);
    }

    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);

    let params = {
      device_type: 'web',
      username: email,
      email: email,
      password: password,
      duid: duid
    };

    // Login the user and get his/her profiles
    // Damn this is thick ... 3 calls until we get the user's details ...
    // Step 1: Login
    this.http.post<APILoginSuccess>(this.globals.endpoints.login, params, {headers: headers})
      .toPromise()
      .then(res => {
        //console.log(res);
        this.globals.userLoggedIn = true;
        this.globals.accountToken = res.account_token;
        this.globals.authToken = res.auth_token;
        this.globals.authTokenExpiration = res.auth_expires;
        this.errorMsg = null;

        // Store the auth_token in local storage for future use (i.e. recover session after refresh or
        // auto-login between sessions)
        localStorage.setItem(this.globals.localStorageKeyPrefix+'AUTHTOKEN', res.auth_token);

        // Also store the account token (needed by a number of API calls)
        localStorage.setItem(this.globals.localStorageKeyPrefix+'ACCTOKEN', res.account_token);


        // Step 2: Get the profiles
        let headers = new HttpHeaders()
          .set('Accept-Language', this.globals.settings.default_language)
          .set('Authorization', 'bearer '+this.globals.authToken);
        let params = new HttpParams()
          .set('account_token', this.globals.accountToken)
          .set('device_type', 'web');

        let endpoint = this.globals.endpoints.profiles.replace('{account_token}', this.globals.accountToken);

        this.http.get<APIDataResponse>(endpoint, {headers: headers, params: params})
          .toPromise()
          .then(
            res => {
              this.globals.userProfiles = res.data;

              // Check if the user has already chosen a profile
              let currProfileToken = localStorage.getItem(this.globals.localStorageKeyPrefix+'CURRPROF');
              if (currProfileToken!=='' && currProfileToken!==null) {
                // Go through the profiles list and get the current one's token
                let found = false;
                this.globals.userProfiles.forEach((element) => {
                  if (element.token === currProfileToken) {
                    found = true;
                    this.globals.accountProfileToken = currProfileToken;
                    // Step 3: With the profile token get the user's details
                    this.getProfile(currProfileToken);
                  }
                });
                // No match was found for the profile token in local storage; default to first
                if (!found) {
                  currProfileToken = this.globals.userProfiles[0].token;
                  this.globals.accountProfileToken = currProfileToken;
                  // Store the 1st one as the current profile
                  localStorage.setItem(this.globals.localStorageKeyPrefix+'CURRPROF', currProfileToken);

                  // Step 3: With the profile token get the user's details
                  this.getProfile(currProfileToken);
                }
              }
              else {
                currProfileToken = this.globals.userProfiles[0].token;
                this.globals.accountProfileToken = currProfileToken;
                // Store the 1st one as the current profile
                localStorage.setItem(this.globals.localStorageKeyPrefix+'CURRPROF', currProfileToken);

                // Step 3: With the profile token get the user's details
                this.getProfile(currProfileToken);
              }

              // Emit finished login to close the login modal and perform other tasks
              this.finishedLogin.next(true);
            }
          )
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch(result => {
        console.error(result.message);
        this.errorMsg.next(result);
      });
  }

  /**
   * Logout a user.
   * This also serves for terminating a session on a different device (by using its Authorization token )
   * @Notes: account token is already in the path. (see globals.service.ts)
   */
  logout() {
    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer '+this.globals.authToken);

    let params = new HttpParams()
      .set('device_type', 'web');

    this.http.delete<APISuccessResponse>(this.globals.endpoints.logout, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.finishedLogout.next(true);
        this.globals.currAvatar = this.globals.defaultAvatar;

          localStorage.removeItem(this.globals.localStorageKeyPrefix+'CURRPROF');
          localStorage.removeItem(this.globals.localStorageKeyPrefix+'AUTHTOKEN');
          localStorage.removeItem(this.globals.localStorageKeyPrefix+'ACCTOKEN');
          this.globals.currAvatar = 'assets/ic-default-avatar.png'; // default avatar
          this.globals.defaultAvatar = 'assets/ic-default-avatar.png';

      })
      .catch(function (error) {
        console.error(error);
      });
  }


  /**
   * Get a profile's details
   * @param {string} token
   * @returns {boolean}
   */
  getProfile(token: string): boolean {
    var success: boolean = false;
    let headers = new HttpHeaders()
      .set('Authorization', 'bearer '+this.globals.authToken);

    let params = new HttpParams()
      .set('device_type', 'web');

    this.http.get<APIDataResponse>(this.globals.endpoints.profile + token, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.globals.currProfile = res.data;
        // Instantly update the user's current avatar on screen
        if (this.globals.currProfile.profile_picture.url !== '')
          this.globals.currAvatar = this.globals.currProfile.profile_picture.url;

        success = true;
      })
      .catch(function (error) {
        console.error(error);
      });
    return success;
  }

  /**
   * Generate Device Unique Id
   * @returns {string} - '00000000-0000-0000-0000-000000000000'
   */
  generateDUID() {
    function _p8(s) {
      var p = (Math.random().toString(16)+"000000000").substr(2,8);
      return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8(false) + _p8(true) + _p8(true) + _p8(false);
  }
}
