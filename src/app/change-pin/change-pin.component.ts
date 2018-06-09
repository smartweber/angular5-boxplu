import { Component, OnInit } from '@angular/core';
import { GlobalsService} from '../globals.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { ChangePinPopupService} from './change-pin-popup.service';
import { RecoverPinPopupService} from '../recover-pin/recover-pin-popup.service';

@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.component.html'
})
export class ChangePinComponent implements OnInit {
  isVisible = false;
  thePin: any;
  showErr = false;
  oldParentalPin: any;

  constructor(
    public globals: GlobalsService,
    private popup: ChangePinPopupService,
    private recoverPinPopup: RecoverPinPopupService,
    private http: HttpClient) {
      popup.show.subscribe((val: boolean) => this.showPopup());
  }

  ngOnInit() {
  }

  showPopup() {
    this.isVisible = true;
    this.thePin = '';
    this.showErr = false;
    this.oldParentalPin = '';
  }

  enterPin() {
    if (this.thePin.toString().length !== 4) {
      this.showErr = true;
      return;
    }
    alert('Code commented... waiting for server side development')
    /*
    let path = this.globals.endpoints.updateParentalPin;
    path = path.replace('{account_token}', this.globals.accountToken);

    const headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', this.globals.settings.authToken);

    const params = new HttpParams()
      .set('device_type', 'web')
      .set('parentalpin' , this.thePin.toString()) must be sent on the string TODO
      .set('oldparentalpin', this.oldParentalPin); send parentalpin and oldparentalpin on the string

    // PUT: Change; POST: user input verification
    this.http.put(path, {headers: headers, params: params})
      .toPromise()
      .then()
      .catch(err => console.error(err));
   */
  }

  handleKey(event: any) {
    const entry = event.target.value.toString();
    let filtered = '';
    let c = '';
    let i;
    this.showErr = false;
    let limit = entry.length;
    if (limit > 4) {  // assuming that the PIN length is 4
      limit = 4;
    }
    for (i = 0; i < limit; i++) {
      c = entry.substring(i, i + 1);
      if (c >= '0' && c <= '9') {
        filtered += c;
      }
    }
    this.thePin = filtered;
  }

  recoverPin() {
    this.isVisible = false;
    this.recoverPinPopup.show.next(true);
  }
}
