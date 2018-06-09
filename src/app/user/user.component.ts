import { Component, OnInit } from '@angular/core';
import {UserService} from "./user.service";
import {User} from "../models/user";
import {Profiles} from "../models/profiles";
import {GlobalsService} from '../globals.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {

  user: User;                                 // All user data
  profiles: Profiles;                         // All the user's profiles
  loggedIn: boolean = false;                  // Quick check flag for user logged in status

  constructor(
    public globals: GlobalsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user = new User();
    // Try to get an account token from a previous login session
    this.user.accountToken = this.getAccountTokenFromLocalStorage();
    if (this.user.accountToken !== null) {
      this.userService.login(this.user.accountToken);
    }

    // Try to get the user's last used profile
    if (this.loggedIn) {
      this.user.currProfileToken = this.getProfileTokenFromLocalStorage();

      if (this.user.currProfileToken!==null)
        this.userService.getProfile(this.user.currProfileToken);
    }


  }

  /**
   * Get the user account token from the local storage
   * @returns {string | null}
   */
  getAccountTokenFromLocalStorage() {
    return localStorage.getItem('accountToken');
  }

  /**
   * Get the profile token from the local storage
   * @returns {string | null}
   */
  getProfileTokenFromLocalStorage() {
    return localStorage.getItem('profileToken')
  }



}
