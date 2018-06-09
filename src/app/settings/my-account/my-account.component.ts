import { Component, OnInit } from '@angular/core';
import { GlobalsService} from "../../globals.service";
import { SessionsService} from "../../sessions/sessions.service";
import { LoginService} from "../../login/login.service";
import {Router} from "@angular/router";
import {ChangePasswordPopupService} from "./change-password/change-password-popup-service";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html'
})
export class MyAccountComponent implements OnInit {

  menuOptions: any[];
  addModalPassVisible: boolean;   // Whether we show the changePassword box or not

  constructor(
    private globals: GlobalsService,
    private sessions: SessionsService,
    private login: LoginService,
    public changePasswordPopupService: ChangePasswordPopupService,
    private router: Router

  ) {

    // subscribe to the sessions service so we can show the list of user session
    this.sessions.sessions.subscribe(value => {
      // Do we have any live sessions?
      if (value.length > 0) {
        this.sessions.isVisible.next(true);
        this.router.navigate(['sessions']);
      }
    });

    // subscribe to the login service for logout option
    this.login.finishedLogout.subscribe(value => {
      if (value) {
        this.router.navigate(['']);
      }
    });
  }

  ngOnInit() {
    this.buildMenuOptions();
  }

  /**
   * Build the buttons for the my account screen
   */
  buildMenuOptions() {
    this.menuOptions = [];



    // first option depends on whether the settings allow more than one profile
    if (this.globals.settings.profiles_limit > 1)
      this.menuOptions.push({btn_text: this.globals.strings.SETTINGS_SCREEN_MANAGE_PROFILES, type: 'router', action: 'manage-profiles'});


    if (this.globals.settings.user_configurations.enabled_features.manage_account!=0) {
        this.menuOptions.push(
            {btn_text: this.globals.strings.SETTINGS_CHANGE_INFO, type: 'router', action: 'edit'},
            {btn_text: this.globals.strings.BUTTON_CHANGE_PASSWORD, type: 'callback', action: this.changePassword.bind(this)});
    }
    if (this.globals.rules.purchasePin)
      this.menuOptions.push({btn_text: this.globals.strings.SETTINGS_EDIT_PURCHASE_PIN, type: 'router', action: 'change-purchase-pin'});

    //if (this.globals.settings.user_configurations.parental_control_enabled)
      this.menuOptions.push({btn_text: this.globals.strings.SETTINGS_SCREEN_PARENTAL_CONTROLS, type: 'router', action: 'parental-control'});

    this.menuOptions.push({btn_text: this.globals.strings.SETTINGS_SCREEN_DEVICES, type: 'callback', action: this.showSessions.bind(this)});

    if (this.globals.rules.manageCreditCard)
      this.menuOptions.push({btn_text: this.globals.strings.BUTTON_MANAGE_CREDIT_CARD, type: 'router', action: 'manage-cc'});

    if (this.globals.rules.subscriptions)
      this.menuOptions.push({btn_text: this.globals.strings.SUBSCRIPTION_PLAN_NAME, type: 'router', action: 'subscription'});

    if (this.globals.settings.user_configurations.authentication_screens.pairing)
        this.menuOptions.push({btn_text: this.globals.strings.SETTINGS_SCREEN_PAIRING_CODE, type: 'router', action: 'pairing'});

    if (this.globals.userLoggedIn)
      this.menuOptions.push({btn_text: this.globals.strings.SETTINGS_SCREEN_SIGN_OUT, type: 'callback', action: this.logout.bind(this)});
  }

  changePassword() {
    this.changePasswordPopupService.show.next(true);
  }

  /**
   * Prepare the list of sessions to be shown
   */
  showSessions() {
    this.sessions.getLiveSessions(this.globals.authToken);
  }

  logout() {
    this.login.logout();
  }

    crumbClick(waytoGo: string) {
    console.log(waytoGo);
        this.router.navigate([waytoGo]);
    }

}
