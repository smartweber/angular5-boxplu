import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {APIDataResponse, APISuccessResponse, GlobalsService} from '../globals.service';
import {Subject} from "rxjs/Subject";
import {Asset} from "../models/asset";
import {Related} from "../models/related";
import swal from 'sweetalert2';
import {LoadingService} from "../loading/loading.service";

@Injectable()
export class DetailsService {

  public asset: Subject<Asset> = new Subject<Asset>();
  private _asset: Asset;    // So that we can immediately access the members :P
  public assetUserRate: Subject<any> = new Subject();
  public related: Subject<Related> = new Subject<Related>();
  public favoriteAdded: Subject<boolean> = new Subject<boolean>();
  public isFavourite: Subject<boolean> = new Subject<boolean>();
  public entitlements: Subject<any> = new Subject<any>();
  public Season: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
    private globals: GlobalsService,
    private loading: LoadingService
  ) {}

  /**
   * Get an asset's details
   * @param {string} id
   * @param {boolean} tvShow
   * @param {number} seasonId
   *
   * @Notes The layout type is already included in the returned response
   *        This determines which layout to show in the view (template)
   */
  getAsset(id: string, tvShow: boolean = false, seasonId: number = null) {
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);
    let params = new HttpParams()
      .set('device_type', 'web')
      .set('device_layout', 'web');

    /*
      As per the API documentation:
      In case a tvshow is being requested, set here the season that API should reply with season episodes
     */
    if (tvShow === true && seasonId !== null)
      params.set('season_id', String(seasonId));

    this.http.get<APIDataResponse>(this.globals.endpoints.assets+'/'+id, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.asset.next(res.data);
        this._asset = res.data;
        this.loading.set(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  /**
   * Get an asset's related list of movies
   * @param {string} id
   *
   * @Notes No idea what this endpoint is good for as the asset's response
   *        from the API already returns a list of related content under
   *        'playlist->contents' ... :S
   */
  getRelated(id: string) {
    // we must replace the asset Id in the path
    var endPoint = this.globals.endpoints.assetsRelated.replace('{asset_id}', id);

    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);
    let params = new HttpParams()
      .set('device', 'web')
      .set('device_type', 'web')
      .set('device_layout', 'web')
      .set('layout_id', String(this._asset.screen.layout.id));

    this.http.get<APIDataResponse>(endPoint, {headers: headers, params: params})
      .toPromise()
      .then( res => {
        this.related.next(res.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  /**
   * Set an asset as a favorite for the current account's profile
   * @param {string} id
   */
  setFavorite(id: string) {
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer '+this.globals.authToken);

    let params = new HttpParams()
      .set('device_type', 'web');

    let endpoint = this.globals.endpoints.assetsFavorite
      .replace('{profile_token}', this.globals.accountProfileToken)
      .replace('{asset_id}', id);

    this.http.post<APISuccessResponse>(endpoint, null, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.favoriteAdded.next(true);
        this.isFavourite.next(true);
      })
      .catch(reason => {
        console.error('Failure to add favorite - '+reason);
        this.favoriteAdded.next(false);
      });
  }

  /**
   * Remove an asset from the favourites list
   * @param {string} id
   */
  unsetFavourite(id: string) {
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer '+this.globals.authToken);

    let params = new HttpParams()
      .set('device_type', 'web');

    let endpoint = this.globals.endpoints.assetsFavorite
      .replace('{profile_token}', this.globals.accountProfileToken)
      .replace('{asset_id}', id);

    this.http.delete<APIDataResponse>(endpoint, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.isFavourite.next(false);
        swal({
            type: 'success',
            title: '<span style="color: #fff;" class="title">'+this.globals.strings.CONTENT_GROUP_BTN_FAVOURITES+'</span>',
            html:  '<span style="color: #fff;">'+this.globals.strings.FAVORITE_REMOVE_SUCCESS+'</span>',
            background: '#2a292a'
          }
        );
      })
      .catch(reason => {
        console.error('Failure to remove favorite - '+reason);
        this.isFavourite.next(false);
      });

  }

  /**
   * Check if the asset is a favorite
   * @param {string} id
   */
  getFavorite(id: string) {
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer '+this.globals.authToken);

    let params = new HttpParams()
      .set('device_type', 'web');

    let endpoint = this.globals.endpoints.assetsFavorite
      .replace('{profile_token}', this.globals.accountProfileToken)
      .replace('{asset_id}', id);

    this.http.get<APIDataResponse>(endpoint, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        if (res.data.favourite == true)
          this.isFavourite.next(true);
        else
          this.isFavourite.next(false);
      })
      .catch(reason => {
        console.error('Failure to add favorite - '+reason);
        this.isFavourite.next(false);
      });

  }

  /**
   * GET my rate of an asset with 1 to 5 stars
   * @param {string} id
   * @param {number} rating
   */
  getmyRateAsset(id: string) {
    // replace the current profile token in the path
    let firstPass = this.globals.endpoints.assetsRate.replace('{profile_token}', this.globals.accountProfileToken);
    // replace the asset Id in the path
    let endPoint = firstPass.replace('{asset_id}', id);

    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer '+this.globals.authToken);

    let params = new HttpParams()
      .set('device_type', 'web');

    this.http.get<APISuccessResponse>(endPoint, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        // return rating
          this.assetUserRate.next(res);
        })
      .catch(function (error) {
        console.error(error);
      });
  }

    /**
     * Rate an asset with 1 to 5 stars
     * @param {string} id
     * @param {number} rating
     */
    rateAsset(id: string, rating: number) {
        // replace the current profile token in the path
        let firstPass = this.globals.endpoints.assetsRate.replace('{profile_token}', this.globals.accountProfileToken);
        // replace the asset Id in the path
        let endPoint = firstPass.replace('{asset_id}', id);

        let headers = new HttpHeaders()
            .set('Accept-Language', this.globals.settings.default_language)
            .set('Authorization', 'Bearer '+this.globals.authToken);

        let params = new HttpParams()
            .set('device_type', 'web');


        this.http.post<APISuccessResponse>(endPoint, {rating: rating}, {headers: headers, params: params})
            .toPromise()
            .then(res => {
                // just show a success dialog
                swal({
                        type: 'success',
                        title: '<span style="color: #fff;" class="title">'+this.globals.strings.GENERIC_THANK_YOU+'</span>',
                        html:  '<span style="color: #fff;">'+this.globals.strings.DETAILS_RATING_SUCCESS+'</span>',
                        background: '#2a292a'
                    }
                );
                this.assetUserRate.next({data:{rating:rating}});
            })
            .catch(function (error) {
                console.error(error);
                swal({
                        type: 'error',
                        title: '<span style="color: #fff;" class="title">'+this.globals.strings.SCREEN_ERROR_TITLE+'</span>',
                        html:  '<span style="color: #fff;">'+this.globals.strings.GENERAL_ERROR+'</span>',
                        background: '#2a292a'
                    }
                );

            });
    }

  /**
   * Get the entitlements for an asset, for a given profile
   * @Notes: the response might change for a finer grain type of control.
   *         For now just assuming that a user can play an asset and don't show
   *         any additional buttons on the asset's details page
   * @param {string} assetId - only accepts numerical id. no slugs allowed (@2018-03-01)
   */
  getEntitlements(assetId: string) {
    const headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer ' + this.globals.authToken);
    const params = new HttpParams()
      .set('device_type', 'web');

    /* Path "vars" */
    let endpoint = this.globals.endpoints.entitlements
      .replace('{profile_token}', this.globals.accountProfileToken)
      .replace('{asset_id}', assetId);

    this.http.get<APIDataResponse>(endpoint, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.entitlements.next(res.data);
      })
      .catch(error => {
        console.error(error);
        this.entitlements.next([]);
      });
  }

  /**
   * GET /tvshow/{tvshow_id}/season/{season_id}/episodes
   * @param {string} id
   * @param {boolean} tvShow
   * @param {number} seasonId
   */
  getSeason(seasonId: string, showId?: string, layoutId?: string) {
    this.loading.set(true);
    // Are now going to suppose that the asset has been read and that this.asset will give showId and layoutId
    let showId2=this._asset.asset.id;
    let layoutId2 = this._asset.screen.blocks[1].widgets[0].layout.id.toString();
    //console.log('getseason '+ seasonId);

    //API path
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);

    //API query
    let params = new HttpParams()
      .set('device_type', 'web')
      .set('device_layout', 'web')
      .set('layout_id',layoutId2); // seasonId vem no SeasData.screen.blocks[1].widgets[0].layout.id

    //API path
    let endpoint = this.globals.endpoints.seasonsEpisodes
      .replace('{tvshow_id}',showId2)
      .replace('{season_id}', seasonId);

    this.http.get<APIDataResponse>(endpoint, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.Season.next(res);
        this.loading.set(false);
      })
      .catch(function (error) {
        console.error(error);
        this.loading.set(false);
      });
  }
}
