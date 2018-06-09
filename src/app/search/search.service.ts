import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import {GlobalsService} from '../globals.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SearchService {

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

  search(term: string): Observable<any> {
    console.log(this.globals.API + `search?`+this.globals.tvcableSearchQuery+ `&q=${term}`);
    return this.http
      .get(this.globals.API + `search?`+this.globals.tvcableSearchQuery+ `&q=${term}`)  // '&device_type=web&device_layout=web&asset_types='+this.tvcableAsset_types;
      .map(this.extractData)
      .catch(this.handleError);
  }
//     http://tvaggregator.tvacms.com/tvcable/api/search?device_type=web&device_layout=web&asset_types=movies,series,channels&q=Cats

  /*
    search(term: string): Observable<any> {
    return this.http
      .get(this.globals.API + `search?q=${term}`+this.globals.tvcableSearchQuery)  // '&device_type=web&device_layout=web&asset_types='+this.tvcableAsset_types;
      .map(this.extractData)
      .catch(this.handleError);
  }

   */
}
