import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GlobalsService} from '../globals.service';
import {LoginPopupService} from './login-popup.service';
/*import {FacebookService, LoginResponse} from "ngx-facebook";*/
import {HttpClient} from "@angular/common/http";
import { SessionsService } from "../../app/sessions/sessions.service";

// import fade in animation
import { fadeInAnimation } from '../_animations/index';
import {LoginService} from "./login.service";
import swal from 'sweetalert2';
import {Router} from '@angular/router';
import {SubscriptionsService} from "../subscriptions/subscriptions.service";
import {ProfileSubscriptions} from "../models/profile-subscriptions";
import {RegisterPopupService} from "../register/register-popup.service";
declare var $:any;



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // make fade in animation available to this component
  animations: [fadeInAnimation]
})

export class LoginComponent implements OnInit,  AfterViewInit {

  isVisible: boolean = false;
  showPassword: boolean = false;
  email: string;    // when doing social_login it will be equal to username
  password: string;
  errorMsg: string = null;
  keepLoginData: boolean = false;

  finishedLogIn: boolean = false;               // Flag indicating whether the login process fully finished
  profileSubscriptions: ProfileSubscriptions;
  selectedProvider: any;

  constructor(
    private http: HttpClient,
    public globals: GlobalsService,
    private loginService: LoginService,
    private popup: LoginPopupService,
    /*private fb: FacebookService,*/
    private router: Router,
    private subscriptionsService: SubscriptionsService,
    private register: RegisterPopupService,
    private sessions: SessionsService
  ) {
    /*fb.init(this.globals.fbParams);*/
    popup.show.subscribe((val: boolean) => this.showPopup());

    // Subscribe to the service's subjects
    this.loginService.finishedLogin.subscribe(value => {
      this.finishedLogIn = value;
      // If we're done with the login process, close the modal!
      if (this.finishedLogIn === true) {
        this.isVisible = false;
        // Save the login into local storage if required
        if (this.keepLoginData) {
          this.saveLogin();
        }

        // Get the current profile's subscriptions
        // @MOD (2018-03-19) check if the rules allow for subscriptions
        if (this.globals.rules.subscriptions)
          this.subscriptionsService.getProfileSubscriptions();
      }
    });

    /* Subscribe to error messages coming from the login service */
    this.loginService.errorMsg.subscribe(value => {
      //this.errorMsg = value.message; // TEMPLATE
      this.errorMsg = value.error.description; // TVCABLE

      // Check if the number of sessions has already been used up
      //if (value.status === 428) { // TEMPLATE
      if (value.status=== 428) { // TVCABLE
        // Get the short lived auth token
        this.globals.tempAuthToken = value.error.auth_token;
        this.globals.accountToken = value.error.account_token;

        this.globals.currUsername=this.email;
        this.globals.currPassword=this.password;

        // Hide the login modal first
        this.isVisible = false;

        swal({
            title: '<span style="color: #fff;">'+this.globals.strings.LOGIN_FAILED_REMOVE_DEVICE+'</span>',
            type: 'error',
            showCancelButton: true,
            confirmButtonText: this.globals.strings.BUTTON_REMOVE,
            cancelButtonText: this.globals.strings.BUTTON_CANCEL,
            background: '#2a292a'
          }
        ).then(result => {
          if (result.value) {
            this.router.navigate(['sessions']);
          }
        });

      }
    });


    /* Subscribe to the profile's subscriptions coming from the subscriptions service */
    this.subscriptionsService.profileSubscriptions.subscribe(value => {
      this.profileSubscriptions = value;

      let hasSubscriptions = false;
      if (this.profileSubscriptions.hasOwnProperty('subscriptions')) {
        if (this.profileSubscriptions.subscriptions.length > 0) {
          hasSubscriptions = true;
          this.globals.hasActiveSubscription = true;
        }
      }

      if (!hasSubscriptions) {
        this.globals.hasActiveSubscription = false;
        swal({
            html: '<span style="color: #fff;">'+this.globals.strings.PROFILE_NO_ACTIVE_SUBSCRIPTIONS+'</span>',
            type: 'warning',
            confirmButtonText: this.globals.strings.BTN_SUBSCRIBE,
            background: '#2a292a'
          }
        ).then(result => {
          if (result.value) {
            this.router.navigate(['subscribe']);
          }
        });
      }
    });


  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    $('.selectpicker').selectpicker();
  }

  showPopup() {
    this.isVisible = true;
    this.errorMsg = null;
  }

  toggleEye() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Regular login using user email and password
   */
  login() {

    // Remember to clear the temporary token upon login...
    this.globals.tempAuthToken = null;

    // Clear error message div
    this.errorMsg = null;

    this.loginService.login(this.email, this.password);

  }

  /**
   * Provider login using the ID number of the user
   */
  providerLogin() {

    // Remember to clear the temporary token upon login...
    this.globals.tempAuthToken = null;

    // Clear error message div
    this.errorMsg = null;

    this.loginService.provider_login("tvcable",this.globals.endpoints.socialLogin,this.email,this.password,null,null);
  }

  /**
   Save login data (account token)
   */
  saveLogin() {
    if (this.globals.accountToken!==null) {
      localStorage.setItem(this.globals.localStorageKeyPrefix+'ACCTKN', this.globals.accountToken);
    }
  }


  facebookLogin(): void {
/*    this.fb.login()
      .then((response: LoginResponse) => {
        console.log('Logged in to facebook', response);
        // TODO: call api with facebook's token (/account/social_login)
        // Note: disregard email, password and token_secret (the latter only being used with twitter)
      })
      .catch(e => console.error('Error logging in'));*/
  }

  /*
   Log/Signout functionality to be implemented in a different place... (in profiles drawer)
   */


  forgotPassword() {
    //window.location.href='https://www.mitvcable.com/recuperar';
    window.open('https://www.mitvcable.com/recuperar', '_blank');
  }

  registerNewUser() {
    //window.location.href='https://www.mitvcable.com/registro';
    window.open('https://www.mitvcable.com/registro', '_blank');
  }

  showRegister() {
    this.register.show.next(true);
  }

}
