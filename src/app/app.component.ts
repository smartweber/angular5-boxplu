import {Component, OnInit} from '@angular/core';
import {Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel} from '@angular/router';
import 'simplebar/dist/simplebar.js';
import {GlobalsService} from "./globals.service";
import {LoginPopupService} from "./login/login-popup.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  viewLandingPage: boolean = true;

  constructor(private router: Router,
              private globals: GlobalsService,
              private login: LoginPopupService) {
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {

      }
      else if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {

      }
    });
  }

  showLogin() {
      if (!this.globals.userLoggedIn)
          this.login.show.next(true);
  }
}
