import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import {GlobalsService} from '../globals.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Subject} from "rxjs/Subject";
import {Widget} from "./widget";

@Injectable()
export class PlaylistService {
  //public playList: Subject<Widget> = new Subject<Widget>();  // Subscribed by the Carousel component to change its content

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

  getPlaylist(id: string, limit: number, page: number, genre?: string): Observable<any> {
    let url = this.globals.API + `playlists/${id}?limit=${limit}&page=${page}&device_type=web&device_layout=web`;
    if(genre!=undefined) {
      url += `&genre_id=${genre}`;
    }
    return this.http
      .get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPlaylistPage(id: string, limit: number, page: number): Observable<any> {
    return this.http
      .get(this.globals.API + `playlists/${id}/assets?limit=${limit}&page=${page}&device_type=web&device_layout=web`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // RuiTest Used by the components that want to change the content of their carousel child component
  //setPlayList(data: Widget){
  //  this.playList.next(data);
  //  console.log("new playList set");
  //}
}
