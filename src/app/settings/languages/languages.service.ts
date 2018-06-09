import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {APIDataResponse, GlobalsService} from "../../globals.service";
import {Subject} from "rxjs/Subject";

@Injectable()
export class LanguagesService {

  public languages: Subject<any[]> = new Subject<any[]>();
  public gotStrings: Subject<boolean> = new Subject<boolean>();


  constructor(
    private globals: GlobalsService,
    private http: HttpClient
  ) { }

  /**
   * Get the application's available languages
   */
  getLanguages() {
    const params = new HttpParams()
      .set('device_type', 'web')
      .set('limit', '20')
      .set('page', '1');

    this.http.get<APIDataResponse>(this.globals.endpoints.languages, {params: params})
      .toPromise()
      .then(res => {
        this.languages.next(res.data);
      })
      .catch(error => {
        console.error(error);
        this.languages.next([]);
      });
  }

  /**
   * Get the application strings from the API.
   * @Notes: globals.settings.default_language should already be set!
   */
  getStrings(lang: string) {
    const headers = new HttpHeaders()
      .set('Accept-Language', lang);
    const params = new HttpParams()
      .set('device', 'web')
      .set('device_type', 'web')
      .set('device_layout', 'web');

    this.http.get<APIDataResponse>(this.globals.endpoints.strings, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.globals.strings = res.data;
        this.globals.settings.default_language = lang;
        this.gotStrings.next(true);

      })
      .catch(error => {
        console.error(error);
        this.globals.strings = {};
        this.gotStrings.next(false);
      });
  }

}
