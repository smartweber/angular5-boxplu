import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { SessionsService } from "./sessions.service";
import {Session} from "../models/session";
import {GlobalsService} from "../globals.service";
import swal from "sweetalert2";

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html'
})
export class SessionsComponent implements OnInit, OnDestroy {

  sessions: Session[];
  isVisible: boolean = false;

  constructor(
    private globals: GlobalsService,
    private service: SessionsService,
    private router: Router
  ) { }

  ngOnInit() {

    this.sessions = []; // Remember to initialize matrices!!!

    this.service.sessions.subscribe(res => {
      this.sessions = res;
    });

    // Subscribe to show/hide user sessions flag
    this.service.isVisible.subscribe(value => {
      this.isVisible = value;
    });

    this.service.finishedClosingSession.subscribe(val => {
      if (val === true) {
        this.isVisible = false;
        // navigate back to home and give the user a clean chance to login
        this.router.navigate(['']);
      }

    });

    // Must check if the temporary auth token is set, otherwise we get an error dialog on website start
    let token = this.globals.tempAuthToken !== null ? this.globals.tempAuthToken : this.globals.authToken;

    if (token !== null) {
      this.isVisible = true;
      this.service.getLiveSessions(token);
    }
  }

  ngOnDestroy() {
    this.sessions = [];
    this.isVisible = false;
  }

  /**
   * Remove (free) a session
   */
  remove(auth_token: string) {

    swal({
        html: '<span style="color: #fff;">'+this.globals.strings.DEVICE_LIST_SCREEN_WILL_LOGOUT+'</span>',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.globals.strings.GENERAL_YES,
        cancelButtonText: this.globals.strings.GENERAL_NO,
        background: '#2a292a'
      }
    ).then(result => {
      if (result.value) {
        this.service.remove(auth_token);
      }
    });
  }

    crumbClick(waytoGo: string) {
        this.router.navigate([waytoGo]);
    }

}
