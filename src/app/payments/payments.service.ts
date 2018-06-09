import { Injectable } from '@angular/core';
import {APIDataResponse, APISuccessResponse, GlobalsService} from "../globals.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Subject} from "rxjs/Subject";
import {ProfilePaymentMethods} from "../models/profile-payment-methods";

@Injectable()
export class PaymentsService {

  public paymentMethods: Subject<ProfilePaymentMethods[]> = new Subject<ProfilePaymentMethods[]>();
  public purchaseResponse: Subject<any> = new Subject<any>();

  constructor(private globals: GlobalsService,
              private http: HttpClient) {
  }

  /**
   * Get the current profile's payment methods
   * uses globals.endpoints.profilePaymentMethods
   * @param {string} gateway
   */
  getProfilePaymentMethods(gateway: string) {
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer ' + this.globals.authToken);
    let params = new HttpParams()
      .set('device_type', 'web');

    let endpoint = this.globals.endpoints.profilePaymentMethods
      .replace('{profile_token}', this.globals.accountProfileToken)
      .replace('{payment_gateway}', gateway);

    this.http.get<APIDataResponse>(endpoint, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.paymentMethods.next(res.data);
      })
      .catch(error => {
        console.error(error);
        this.paymentMethods.next([]);
      });
  }

  /**
   * Purchase/subscribe a product in a store
   *
   * @param {string} productId (body) - Asset ID in case of TVOD, Plan ID in case of SVOD
   * @param {string} purchaseType (body) - (TVOD / SVOD) SVOD == Subscriptions, TVOD == Assets
   * @param {string} paymentGateway (body) - (stripe, voucher or token)
   * @param {string} storeProductId (body) - (in case of subscription this is the plan id)
   * @param {string} paymentMethodToken (body) - required if the purchase if via stripe (credit card)
   */
  purchase(productId: string, purchaseType: string, paymentGateway: string, storeProductId: string, paymentMethodToken: string = null) {
    const headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer ' + this.globals.authToken);
    const params = new HttpParams()
      .set('device_type', 'web');

    /* Path "vars" */
    let endpoint = this.globals.endpoints.purchase
      .replace('{profile_token}', this.globals.accountProfileToken);

    /* Body */
    let body = {
      product_id: productId,
      purchase_type: purchaseType,
      payment_gateway: paymentGateway,
      store_product_id: storeProductId,
      payment_method_token: paymentMethodToken
    };

    this.http.post(endpoint, body, {headers: headers, params: params})
      .toPromise()
      .then(res => {
        this.purchaseResponse.next(res);
        }
      )
      .catch(error => {
        this.purchaseResponse.next(error);
      });
  }

}
