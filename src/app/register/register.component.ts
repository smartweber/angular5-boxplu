import {Component, OnInit} from '@angular/core';
import {GlobalsService} from '../globals.service';
import {RegisterPopupService} from './register-popup.service';
import {RegisterService} from "./register.service";
import swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {

  isVisible: boolean = false;
  showPassword: boolean = false;

  /* 2-way bindings to form inputs */
  userEmail: string;
  userPassword: string;
  userFirstName: string;
  userLastName: string;
  userMobile: string;
  userAddress: string;
  userZipCode: string;




  constructor(
    public globals: GlobalsService,
    private popup: RegisterPopupService,
    private service: RegisterService
  ) {
    popup.show.subscribe((val: boolean) => this.showPopup());
  }

  ngOnInit() {
    // Subscribe to the service's response for registering a new user
    this.service.registerResponse.subscribe(val => {
      this.isVisible = false;

      if (val.code === '200' || val.success === 1) {
        // show success modal
        swal({
            type: 'success',
            title: '<span style="color: #fff;" class="title">'+this.globals.strings.GENERIC_SUCCESS+'</span>',
            html:  '<span style="color: #fff;">'+this.globals.strings.REGISTER_SCREEN_REGISTRATION_SUCCESSFUL+'</span>',
            background: '#2a292a'
          }
        );
      }
      else {
        // show error modal
        swal({
            type: 'error',
            title: '<span style="color: #fff;" class="title">'+this.globals.strings.GENERAL_ERROR+'</span>',
            html:  '<span style="color: #fff;">'+val.error.description+'</span>',
            background: '#2a292a'
          }
        );
      }
    });

  }

  showPopup() {
    this.isVisible = true;
  }

  toggleEye() {
    this.showPassword = !this.showPassword;
  }

  /**
   * handle submission of a new user
   */
  onSubmit() {
    // Remember to set this.isVisible to false on success (also redirect to home)
    // Subscribe to this above .... :P
    this.service.registerNewUser(
      this.userEmail,
      this.userPassword,
      this.userFirstName,
      this.userLastName,
      this.userMobile,
      this.userAddress,
      this.userZipCode );
  }




}
