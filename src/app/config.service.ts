/*
This code is ran before anything else in the website
 */

import {Injectable} from '@angular/core'
import {APIDataResponse, GlobalsService} from './globals.service'
import 'rxjs/add/operator/toPromise';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {SubscriptionsService} from "./subscriptions/subscriptions.service";

@Injectable()
export class ConfigService {

  constructor(
    private http: HttpClient,
    private globals: GlobalsService,
    private subscriptionService: SubscriptionsService
  ) {}

  load(): Promise<boolean> {

    return new Promise<boolean>((resolve) => {
      // First off, get settings and chain other vital tasks
      // build_version doesn't seem to be relevant on website, defaulting to '1'
      const params = new HttpParams()
        .set('device_type', 'web')
        .set('device_layout', 'web')
        .set('build_version', '1');

      this.http.get<APIDataResponse>(this.globals.endpoints.settings, {params: params})
        .toPromise()
        .then(
          res => {
            this.globals.settings = res.data;

            if (this.globals.settings.user_configurations.hasOwnProperty('authentication_providers'))
            {
              this.globals.nbrOfLoginProviders = this.globals.settings.user_configurations.authentication_providers.length;
            }

            // FIXME: delete after testing!
            //this.globals.nbrOfLoginProviders = 3;

            // Get available languages.
            const params = new HttpParams()
              .set('device_type', 'web')
              .set('limit', '20')
              .set('page', '1');

            this.http.get<APIDataResponse>(this.globals.endpoints.languages, {params: params})
              .toPromise()
              .then(
                res => {
                  this.globals.languages = res.data;

                  // Get the app's strings based on the default language
                  // TODO: implement browser language detection for auto selection of the language (fallback to EN)
                  const headers = new HttpHeaders()
                    .set('Accept-Language', this.globals.settings.default_language);
                  const params = new HttpParams()
                    .set('device_type', 'web');

                  this.http.get<APIDataResponse>(this.globals.endpoints.strings, {headers: headers, params: params})
                    .toPromise()
                    .then(
                      res => {
                        this.globals.strings = res.data;

                        // Get the available subscriptions for this platform
                        // @MOD 2018-03-19 - Check if the rules allow subscriptions
                        if (this.globals.rules.subscriptions)
                          this.subscriptionService.getAllSubscriptions();


                          /*
                           * @Bug fix/feature implementation 2018-05-19 - (pdoriam)
                           * Maintain user logged-in status after refresh/between sessions
                           * @Notes: check if there's an auth_token and profile_token in local storage
                           *         and auto-login user if so.
                           */
                          let profileToken = localStorage.getItem(this.globals.localStorageKeyPrefix+'CURRPROF');
                          let authToken = localStorage.getItem(this.globals.localStorageKeyPrefix+'AUTHTOKEN');
                          let accToken = localStorage.getItem(this.globals.localStorageKeyPrefix+'ACCTOKEN');

                          if (profileToken!=null && authToken!=null && accToken!=null) {
                              // Auto-login user
                              let endpoint = this.globals.endpoints.sessionStatus.replace('{profile_token}', profileToken);
                              let headers = new HttpHeaders()
                                  .set('Authorization', 'bearer '+authToken);
                              let params = new HttpParams()
                                  .set('device_type', 'web');

                              this.http.get<APIDataResponse>(endpoint, {headers: headers, params: params})
                                  .toPromise()
                                  .then(res => {
                                      // Success, session is still alive, set the global vars and the get the user info
                                      this.globals.userLoggedIn = true;
                                      this.globals.accountToken = accToken;
                                      this.globals.authToken = authToken;
                                      this.globals.accountProfileToken = profileToken;

                                      // Get the user details for filling the info
                                      let headers = new HttpHeaders()
                                          .set('Authorization', 'bearer '+this.globals.authToken);

                                      let params = new HttpParams()
                                          .set('device_type', 'web');

                                      this.http.get<APIDataResponse>(this.globals.endpoints.profile + profileToken, {headers: headers, params: params})
                                          .toPromise()
                                          .then(res => {
                                              this.globals.currProfile = res.data;
                                              // Instantly update the user's current avatar on screen
                                              if (this.globals.currProfile.profile_picture.url !== '')
                                                  this.globals.currAvatar = this.globals.currProfile.profile_picture.url;

                                              resolve(true);
                                          })
                                          .catch(function (error) {
                                              console.error(error);
                                              resolve(true);
                                          });
                                  })
                                  .catch(function (error) {
                                      console.error(error);
                                      // Either way resolve this promise and get back to business
                                      // @notes: the user will have to login...
                                      resolve(true);
                                  });
                          }
                          else {
                              // Either way resolve this promise and get back to business
                              // @notes: the user will have to login...
                              resolve(true);
                          }
                      }
                    )
                    .catch(function (error) {
                      console.error(error);
                    });
                }
              )
              .catch(function (error) {
                console.error(error);
              });
          }
        )
        .catch(function (error) {
          console.error(error);
        });
    });

  }

}
