import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {APIDataResponse, APISuccessResponse, GlobalsService} from '../globals.service';
import {Subject} from "rxjs/Subject";
import {Asset} from "../models/asset";
import {Stream} from "../models/stream";

@Injectable()
export class PlayerService {

  public asset: Subject<Asset> = new Subject<Asset>();
  private _asset: Asset;    // if we need to access the data immediately
  public stream: Subject<Stream> = new Subject<Stream>();
  private _stream: Stream;  // if we need to access the data immediately


  constructor(
    private http: HttpClient,
    private globals: GlobalsService
  ) { }

  /**
   * Get an asset's details by its ID
   * @Notes also gets the related
   * @param {string} id
   */
  getAssetDetails(id: string) {
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);
    let params = new HttpParams()
      .set('device_type', 'web')
      .set('device_layout', 'web');

    this.http.get<APIDataResponse>(this.globals.endpoints.assets+'/'+id, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.asset.next(res.data);
        this._asset = res.data;
      })
      .catch(function (error) {
        console.error(error);
      });
  }


  /**
   * Get an asset's video stream, given its ID and the stream's
   * @param {string} assetID
   * @param {string} streamID
   */
  getStream(assetID: string, streamID: string) {
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer '+this.globals.authToken);
    let params = new HttpParams()
      .set('device_type', 'web')
      .set('device_layout', 'web');

    // assetsStream: this.API + '/assets/{asset_id}/streams/{stream_id}'

    // replace the current profile token in the path
    let firstPass = this.globals.endpoints.assetsStream.replace('{asset_id}', assetID);
    let endpoint = firstPass.replace('{stream_id}', streamID);


    this.http.get<APIDataResponse>(endpoint, {headers: headers, params: params})
      .toPromise()
      .then( res => {
        this.stream.next(res.data);
        this._stream = res.data;
      });
  }
}
