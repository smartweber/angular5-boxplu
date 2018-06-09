import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {APIDataResponse, GlobalsService} from "../../../globals.service";
import {Subject} from "rxjs/Subject";

@Injectable()
export class PairingService {

  response: Subject<any>  = new Subject<any>();
  // Differences of response being an observable of type Subject rather then of type Observable:
  // 1-  All subscribers to this response (Subject) will share the same execution of the Subject and thus receive the same data
  // 1a- For an Observable each subscriber causes an independent execution of the observable.
  // 2-  I thinks less important for this local use, this response (Subject) is able, apart from producing data, to also consume it
  // 2a- An Observable is only a data producer

  constructor(private http: HttpClient,
              private globals: GlobalsService) { }

  /**
   * Send pairing code to validate STV session
   */
  putPairing(pairingCode: string) {

    // check if a DUID is already in local storage. If not generate a new one and store it.
    var duid = localStorage.getItem(this.globals.localStorageKeyPrefix+'DUID');

    if (duid === '' || duid === null) {
      duid = this.generateDUID();
      localStorage.setItem(this.globals.localStorageKeyPrefix+'DUID', duid);
    }
    //API header
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer '+this.globals.authToken);

    //API query
    let params = new HttpParams()
      .set('device_type', 'web')
      .set('duid', duid)

    //API path
    let endpoint = this.globals.endpoints.pairingCode
      .replace('{profile_token}', this.globals.accountProfileToken);

    this.http.put<APIDataResponse>(endpoint, {pairing_code:pairingCode},{headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.response.next(res);
      })
      .catch(error => {
        console.error(error);
        this.response.next(error);
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
