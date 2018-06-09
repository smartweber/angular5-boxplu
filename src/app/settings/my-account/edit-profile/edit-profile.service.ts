import { Injectable } from '@angular/core';
import { GlobalsService} from "../../../globals.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Subject} from "rxjs/Subject";

@Injectable()
export class EditProfileService {

  public editResponse: Subject<any> = new Subject<any>();

  constructor(
    public globals: GlobalsService,
    public http: HttpClient
  ) { }


  /**
   * Upload a new avatar for the current profile
   * @param file
   */
  uploadAvatar(file) {

    // Get the current profile's id first...
    // @Notes: the endpoint dedicated to returning the profile info SHOULD return this!!

      //let profileId = this.getProfileId(this.globals.accountProfileToken);
    //
      let profileId =this.globals.accountProfileToken;
      console.log(this.globals.currProfile);

    let formData = {
        image: '',
        profile_id: profileId,
        name: this.globals.currProfile.name,
        email: this.globals.currProfile.email
    };
console.log(formData);
      console.log(this.globals.userProfiles);
      /* Body */
      /* 'assets/close-dialog-icon-32x32.png',
      let formData = {
        image: file[0].name,
        profile_id: profileId,
        name: this.globals.currProfile.name,
        email: this.globals.currProfile.email
      };
      */

    const headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language)
      .set('Authorization', 'Bearer '+this.globals.authToken);

    const params = new HttpParams()
      .set('device_type', 'web');

    let endpoint = this.globals.endpoints.profiles.replace('{account_token}', this.globals.accountToken);

    this.http.post(endpoint, formData, {headers: headers, params: params})
      .toPromise()
      .then( res => {
        this.editResponse.next(res);
      })
      .catch( error => {
        this.editResponse.next(error);
      });
  }

  /**
   * Get the id of a profile from a given token
   * @param {string} token
   */
  getProfileId(token: string) : string {
    let pId = null;
    this.globals.userProfiles.forEach((element) => {
      if (element.token === token) {
        pId = element.id;
      }
    });
    return pId;
  }

}

