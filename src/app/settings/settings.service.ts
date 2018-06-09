import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {APIDataResponse, GlobalsService} from "../globals.service";

@Injectable()
export class SettingsService {

  // to know wether certain components (like TERMS & CONDITIONS) need breadcrums I'll introduce a hasBreadCrums variable
  // found it unnecessary to create a service just for this purpose
  hasBreadCrums = true;


  public gotSettings: Subject<boolean> = new Subject<boolean>();


  constructor(
    private globals: GlobalsService,
    private http: HttpClient
  ) { }

  /**
   * Get the settings from the API and store them under globals
   */
  getSettings() {
    // since the settings read from the API will overwrite the user-selected language we save it here to rewrite it back
    let user_lang = this.globals.settings.default_language;
    const headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);

    const params = new HttpParams()
      .set('device_type', 'web')
      .set('device_layout', 'web')
      .set('build_version', '1');
    this.http.get<APIDataResponse>(this.globals.endpoints.settings, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.globals.settings = res.data;
        this.globals.settings.default_language=user_lang;
        this.gotSettings.next(true);
      })
      .catch(error => {
        console.error(error);
        this.gotSettings.next(false)
      });
  }

  setBreadCrums(setIt:boolean){
    this.hasBreadCrums = setIt;
  }
  getBreadCrums() {
    return this.hasBreadCrums;
  }

}
