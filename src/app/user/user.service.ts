import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GlobalsService} from '../globals.service';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient,
    private globals: GlobalsService
  ) { }

  /**
   * Register a new user
   */
  register() {

  }

  /**
   * Login a user with an existing account token
   * @param {string} token
   */
  login (token:string) {

  }


  /**
   * Get all the user's profiles
   * @param {string} account token
   */
  getProfiles(token:string) {

  }

  /**
   * Get profile data
   * @param {string} profile token
   */
  getProfile(token:string) {

  }

}
