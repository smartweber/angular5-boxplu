import { Injectable } from '@angular/core';
import {GlobalsService} from '../globals.service';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Subject} from "rxjs/Subject";

@Injectable()
export class RegisterService {

  registerResponse: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private globals: GlobalsService
  ) {}

  /**
   * Register a new user
   * @param {string} userEmail
   * @param {string} userPassword
   * @param {string} userFirstName
   * @param {string} userLastName
   * @param {string} userMobile
   * @param {string} userAddress
   * @param {string} userZipCode
   */
  registerNewUser(userEmail:string,
                  userPassword: string,
                  userFirstName: string,
                  userLastName: string,
                  userMobile: string,
                  userAddress: string,
                  userZipCode: string) {

    // check if a DUID is already in local storage. If not generate a new one and store it.
    var duid = localStorage.getItem(this.globals.localStorageKeyPrefix+'DUID');

    if (duid === '' || duid === null) {
      duid = this.generateDUID();
      localStorage.setItem(this.globals.localStorageKeyPrefix+'DUID', duid);
    }

    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);
    let params = new HttpParams()
      .set('device_type', 'web')
      .set('duid', duid);

    let body = {
      email: userEmail,
      password: userPassword,
      name: userFirstName+' '+userLastName,
      image: '', // This is sent empty so that the server gives one to this account
      mobile_number: userMobile,
      address: userAddress,
      post_code: userZipCode,
      country: '', // Wasn't part of the mockups at the time of this writing, so left untouched
      gender: '', // ditto as above
      birth_date: '' // ditto as above
    };

    this.http.post(this.globals.endpoints.register, body, {headers: headers, params: params})
      .toPromise()
      .then(res => {
          this.registerResponse.next(res);
        }
      )
      .catch(error => {
        this.registerResponse.next(error);
      });
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
