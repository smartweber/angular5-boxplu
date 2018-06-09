import { Component, OnInit } from '@angular/core';
import { GlobalsService} from '../globals.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import { RecoverPinPopupService} from './recover-pin-popup.service';

@Component({
  selector: 'app-recover-pin',
  templateUrl: './recover-pin.component.html'
})
export class RecoverPinComponent implements OnInit {
  isVisible = false;

  constructor(
    public globals: GlobalsService,
    private popup: RecoverPinPopupService,
    private http: HttpClient) {
      popup.show.subscribe((val: boolean) => this.showPopup());
  }

  ngOnInit() {
  }

  showPopup() {
    this.isVisible = true;
  }

  hidePopup() {
    this.isVisible = false;
  }

  sendEmail() {
    /*
    let path = this.globals.endpoints.recoverParentalPin;
    path = path.replace('{account_token}', this.globals.accountToken);

    const headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', this.globals.settings.authToken);

    const params = new HttpParams()
      .set('device_type', 'web');

    this.http.put(path, {headers: headers, params: params})
      .toPromise()
      .then()
      .catch(err => console.error(err));
*/
    alert('Code to send email is commented! Waiting for server development');
    this.hidePopup();
  }
}
