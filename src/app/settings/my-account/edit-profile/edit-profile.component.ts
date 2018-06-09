import { Component, OnInit } from '@angular/core';
import {GlobalsService} from "../../../globals.service";
import {EditProfileService} from "./edit-profile.service";
import swal from "sweetalert2";
import {RegisterPopupService} from "../../../register/register-popup.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {

  showPassword: boolean = false;

  email: string;
  name: string;
  address: string;
  zipCode: string;

  constructor(
    private globals: GlobalsService,
    private editProfileService: EditProfileService,
    private router: Router

  ) {
    /* Subscribe to the service's subjects */
    this.editProfileService.editResponse.subscribe(val => {
      if (val.code == '200' || val.success== 1) {
        swal({
            type: 'success',
            title: '<span style="color: #fff;" class="title">'+this.globals.strings.EDIT_PROFILE_EDITED+'</span>',
            background: '#2a292a'
          }
        );
      }
      else {
        swal({
            type: 'error',
            title: '<span style="color: #fff;" class="title">'+this.globals.strings.SCREEN_ERROR_TITLE+'</span>',
            html:  '<span style="color: #fff;">'+val.description+'</span>',
            background: '#2a292a'
          }
        );
      }
    });
  }

  ngOnInit() {
    // Fill the form's inputs with the current profile data
    this.email = this.globals.currProfile.email;
    this.name = this.globals.currProfile.name;
    this.address = this.globals.currProfile.address;
  }

  /**
   * Modify profile's avatar with image uploaded by the user
   * @param event
   */
  uploadFile(event) {

    let files = event.target.files;
    if (files.length > 0) {
      console.log(files); // You will see the file
      this.editProfileService.uploadAvatar(files);
    }
  }

  crumbClick(waytoGo: string) {
      this.router.navigate([waytoGo]);
  }

}
