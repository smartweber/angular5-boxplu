import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import {GlobalsService} from '../globals.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class GuideService {

  constructor(
    private http: Http,
    private globals: GlobalsService
  ) {}

  private extractData(res: Response) {
    let body = res.json();
    if (body) {
      return body.data || body;
    } else {
      return {};
    }
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  getGuide(start: number, genre: string): Observable<any> {
    let url = this.globals.API + `epg?device_type=web&device_layout=web&datetimestamp=${start}`;
    if(genre != undefined) {
      url +=`&genre_id=${genre}`;
    }
    return this.http
      .get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
