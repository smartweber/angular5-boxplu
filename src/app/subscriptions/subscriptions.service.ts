import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Subject} from "rxjs/Subject";
import { GlobalsService} from "../globals.service";
import {Subscriptions} from "../models/subscriptions";
import {ProfileSubscriptions} from "../models/profile-subscriptions";


@Injectable()
export class SubscriptionsService {

  public allSubscriptions: Subject<Subscriptions> = new Subject<Subscriptions>();
  public profileSubscriptions: Subject<ProfileSubscriptions> = new Subject<ProfileSubscriptions>();
  public subscriptionCancelled: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private globals: GlobalsService
  ) { }


  /**
   * Get all available subscriptions
   */
  getAllSubscriptions() {
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);

    let params = {
      device_type: 'web'
    }

    this.http.get<Subscriptions>(this.globals.endpoints.subscriptions, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.globals.subscriptions = res;
        // Emit this to whatever has subscribed
        this.allSubscriptions.next(res);

      })
      .catch(result => {
        console.error(result);
        // Empty the list
        let empty = <any>[];
        this.globals.subscriptions = empty;
        this.allSubscriptions.next(empty);
      });
  }

  /**
   * Get all subscriptions for a given profile
   */
  getProfileSubscriptions() {
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer ' + this.globals.authToken);      // Not sure if the latter is needed ...

    let params = {
      device_type: 'web'
    };

    let endpoint = this.globals.endpoints.profileSubscriptions
      .replace('{profile_token}', this.globals.accountProfileToken);

    // WARNING! This response ISN'T encapsulated in data!
    this.http.get(endpoint, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.globals.profileSubscriptions = <any>res;
        this.profileSubscriptions.next(<any>res);
      })
      .catch(result => {
        console.error(result);
        // Empty the list
        let emptyArr : ProfileSubscriptions = <any>[];
        this.profileSubscriptions.next(emptyArr);
      });
  }

  /***
   * Cancel a subscription for the current profile
   * @param {string} planId
   */
  cancelSubscription(planId: string) {
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer ' + this.globals.authToken);

    let params = {
      device_type: 'web'
    };

    let endpoint = this.globals.endpoints.cancelSubscription
      .replace('{profile_token}', this.globals.accountProfileToken);

    let body = {
      plan_id: planId
    };

    this.http.post(endpoint, body, {headers: headers, params: params})
      .toPromise()
      .then(res => {
          this.subscriptionCancelled.next(true);
        }
      )
      .catch(error => {
        this.subscriptionCancelled.next(false);
      });
  }

}
