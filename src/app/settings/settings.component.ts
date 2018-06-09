import { Component, OnInit } from '@angular/core';
import { SettingsService } from "./settings.service";
import { LanguagesService} from "./languages/languages.service";
import {LoadingService} from "../loading/loading.service";
import {GlobalsService} from "../globals.service";
import {LoginService} from "../login/login.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {

  private gotSettings: boolean = false;
  private gotLanguages: boolean = false;
  private gotStrings: boolean = false;
  private languages: any[] = [];


  menuOptions: any[] = [];

  /*
    @Notes
    The flow here is to get the settings first, then the languages and lastly the strings
    so we can build the settings menu options according to design and API directions
   */



  constructor(
    public globals: GlobalsService,
    public settingsService: SettingsService,
    private languagesService: LanguagesService,
    private loginService: LoginService,
    private loading: LoadingService
  ) {

    this.settingsService.gotSettings.subscribe( val => {
      this.loading.set(false);
      this.gotSettings = val;
      console.log("Rui Teste. gotSettings:"+this.gotSettings+" numlanguages: "+this.globals.languages.length);

      if (this.gotSettings===true && this.globals.languages.length < 1) {
        this.languagesService.getLanguages();
      }
      else {
        this.buildMenuOptions();
      }
    });

    this.languagesService.languages.subscribe(val => {
      if (val.length > 0 ) {
        this.languages = val;
        this.gotLanguages = true;
      }
      else {
        this.languages = [];
        this.gotLanguages = false;
      }

      // Now get the strings regardless of having 1 or more languages (or even none! :P )
      this.languagesService.getStrings(this.globals.settings.default_language);
    });

    // Get the language strings after we got the languages
    this.languagesService.gotStrings.subscribe( val => {
      this.gotStrings = val;
      // Ok.. about done
      if (this.gotSettings && this.gotStrings)
        this.buildMenuOptions()
    });

    // Subscribe to the finishedLogin subject of the Login service so we can change the menu options
    // when we're already here (settings page) and the user logs in
    this.loginService.finishedLogin.subscribe(value => {
      if (value===true)
        this.buildMenuOptions();
    });

  }

  ngOnInit() {
    this.settingsService.setBreadCrums(true);
    this.menuOptions = [];
    // Show a loading status while we get the settings
    if (!this.gotSettings) {
      this.loading.set(true);
      this.settingsService.getSettings();
    }
  }

  /**
   * Build the menu options to be shown in the view depending on the logged
   * status of the user
   */
  buildMenuOptions() {
    this.menuOptions = [];

    if (this.globals.userLoggedIn) {
      this.menuOptions.push({
        option: this.globals.strings.SETTINGS_SCREEN_MY_ACCOUNT, // @Notes: this must be capitalized, per design
        desc: this.globals.strings.SETTINGS_SCREEN_MY_ACCOUNT_LONG,
        action: this.globals.strings.SETTINGS_SCREEN_CHANGE,
        route: 'my-account'});

      // If we only have 1 language ... don't even bother showing the change language option :P
      if (this.globals.languages.length > 1)
        this.menuOptions.push({
          option: this.globals.strings.SETTINGS_SCREEN_CHANGE_LANGUAGE,
          desc: this.globals.strings.SETTINGS_SCREEN_CHANGE_LANGUAGE_LONG,
          action: this.globals.strings.SETTINGS_SCREEN_CHANGE,
          route: 'languages'});

      // @Notes 2018-03-06 - some members of the settings response don't exist yet
      //                     so unneeded check code here ... @:(
      if (this.globals.settings.hasOwnProperty('terms_conditions_slug')) {
        if (this.globals.settings.terms_conditions_slug !== '')
          this.menuOptions.push({
            option: this.globals.strings.SETTINGS_TERMS_AND_CONDITIONS,
            desc: this.globals.strings.SETTINGS_TERMS_AND_CONDITIONS_LONG,
            action: this.globals.strings.SETTINGS_SCREEN_READ,
            route: 'terms-conditions'});
      }
      if (this.globals.settings.hasOwnProperty('faq_slug')) {
        if (this.globals.settings.faq_slug !== '')
          this.menuOptions.push({
            option: this.globals.strings.SETTINGS_SCREEN_FAQ,
            desc: this.globals.strings.SETTINGS_SCREEN_FAQ_LONG,
            action: this.globals.strings.SETTINGS_SCREEN_READ,
            route: 'faq'});
      }
      if (this.globals.settings.hasOwnProperty('help_slug')) {
        if (this.globals.settings.help_slug !== '')
          this.menuOptions.push({
            option: this.globals.strings.SETTINGS_SCREEN_HELP,
            desc: this.globals.strings.SETTINGS_SCREEN_HELP_LONG,
            action: this.globals.strings.SETTINGS_SCREEN_READ,
            route: 'help'});
      }

      this.menuOptions.push({
        option: this.globals.strings.SETTINGS_SCREEN_ABOUT,
        desc: this.globals.strings.SETTINGS_SCREEN_ABOUT_LONG,
        action: this.globals.strings.SETTINGS_SCREEN_READ,
        route: 'about'});
    }
    else {
      // Menu options when the user is not logged in
      if (this.globals.languages.length > 1)
        this.menuOptions.push({
          option: this.globals.strings.SETTINGS_SCREEN_CHANGE_LANGUAGE,
          desc: this.globals.strings.SETTINGS_SCREEN_CHANGE_LANGUAGE_LONG,
          action: this.globals.strings.SETTINGS_SCREEN_CHANGE,
          route: 'languages'});

      if (this.globals.settings.hasOwnProperty('terms_conditions_slug')) {
        if (this.globals.settings.terms_conditions_slug !== '')
          this.menuOptions.push({
            option: this.globals.strings.SETTINGS_TERMS_AND_CONDITIONS,
            desc: this.globals.strings.SETTINGS_TERMS_AND_CONDITIONS_LONG,
            action: this.globals.strings.SETTINGS_SCREEN_READ,
            route: 'terms-conditions'});
      }
      if (this.globals.settings.hasOwnProperty('faq_slug')) {
        if (this.globals.settings.faq_slug !== '')
          this.menuOptions.push({
            option: this.globals.strings.SETTINGS_SCREEN_FAQ,
            desc: this.globals.strings.SETTINGS_SCREEN_FAQ_LONG,
            action: this.globals.strings.SETTINGS_SCREEN_READ,
            route: 'faq'});
      }
      if (this.globals.settings.hasOwnProperty('help_slug')) {
        if (this.globals.settings.help_slug !== '')
          this.menuOptions.push({
            option: this.globals.strings.SETTINGS_SCREEN_HELP,
            desc: this.globals.strings.SETTINGS_SCREEN_HELP_LONG,
            action: this.globals.strings.SETTINGS_SCREEN_READ,
            route: 'help'});
      }

      this.menuOptions.push({
        option: this.globals.strings.SETTINGS_SCREEN_ABOUT,
        desc: this.globals.strings.SETTINGS_SCREEN_ABOUT_LONG,
        action: this.globals.strings.SETTINGS_SCREEN_READ,
        route: 'about'});
    }

  }

}
