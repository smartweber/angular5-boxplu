import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {APIDataResponse, GlobalsService} from '../../../globals.service';
import {Subject} from "rxjs/Subject";
import {AgeRatings} from "../../../models/age-ratings";

@Injectable()
export class ParentalService {

  ageRatings: Subject<AgeRatings> = new Subject<AgeRatings>();
  setParentalResponse: Subject<any> = new Subject<any>();
  verifyParentalPinResponse: Subject<any> = new Subject<any>();
  updateParentalPinResponse: Subject<any> = new Subject<any>();
  recoverParentalPinResponse: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient, private globals: GlobalsService) {
  }

  getAgeRatings() {
    const headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);
    const params = new HttpParams()
      .set('device_type', 'web');

    let endpoint = this.globals.endpoints.ageRatings
      .replace('{country_code}', this.globals.settings.default_age_rating_country_code);

    this.http.get<AgeRatings>(endpoint, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.ageRatings.next(res);
        this.globals.ageRatings = res;
      });
  }

  /**
   * Set parental control on/off or apply setting
   * Also sets the parental pin if the user hasn't set one yet; otherwise pins must match
   * @param {string} parental_control_id
   * @param {string} parental_pin
   */
  setParentalControl(parental_control_id: string, parental_pin: string) {
    const endpoint = this.globals.endpoints.setParentalControl
      .replace('{profile_token}', this.globals.accountProfileToken);

    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer '+this.globals.authToken)
      .set('Accept-Language', this.globals.settings.default_language);

    const params = new HttpParams()
      .set('device_type', 'web');

    const body = {
      parental_control_id: parental_control_id,
      parentalpin: parental_pin
    };

    this.http.put<APIDataResponse>(endpoint, body,{headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.setParentalResponse.next(res);
      })
      .catch(error => {
        console.error(error);
        this.setParentalResponse.next(error);
      });
  }

  /**
   * Verify current parental pin (usually prior to change setting)
   * @param {string} parentalpin
   */
  verifyParentalPin(parentalpin: string) {
    const endpoint = this.globals.endpoints.verifyParentalPin
      .replace('{profile_token}', this.globals.accountProfileToken);

    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer '+this.globals.authToken)
      .set('Accept-Language', this.globals.settings.default_language);

    const params = new HttpParams()
      .set('device_type', 'web');

    const body = {
      parentalpin: parentalpin
    };

    this.http.post<APIDataResponse>(endpoint, body,{headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.verifyParentalPinResponse.next(res);
      })
      .catch(error => {
        console.error(error);
        this.verifyParentalPinResponse.next(error);
      });
  }

  changeParentalPin(oldPin: string, newPin: string) {
    const endpoint = this.globals.endpoints.changeParentalPin
      .replace('{profile_token}', this.globals.accountProfileToken);

    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer '+this.globals.authToken)
      .set('Accept-Language', this.globals.settings.default_language);

    const params = new HttpParams()
      .set('device_type', 'web');

    const body = {
      oldparentalpin: oldPin,
      parentalpin: newPin
    };

    this.http.put<APIDataResponse>(endpoint, body,{headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.updateParentalPinResponse.next(res);
      })
      .catch(error => {
        console.error(error);
        this.updateParentalPinResponse.next(error);
      });
  }

  recoverParentalPin() {
    const endpoint = this.globals.endpoints.recoverParentalPin
      .replace('{profile_token}', this.globals.accountProfileToken);

    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer '+this.globals.authToken)
      .set('Accept-Language', this.globals.settings.default_language);

    const params = new HttpParams()
      .set('device_type', 'web');

    const body = {};

    this.http.put<APIDataResponse>(endpoint, body,{headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.recoverParentalPinResponse.next(res);
      })
      .catch(error => {
        console.error(error);
        this.recoverParentalPinResponse.next(error);
      });
  }
}
