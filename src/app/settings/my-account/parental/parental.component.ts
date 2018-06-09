import { Component, OnInit } from '@angular/core';
import {GlobalsService} from '../../../globals.service';
import {ParentalPopupService} from './parental-popup.service';
import {ParentalService} from './parental.service';
import {RecoverPinPopupService} from '../../../recover-pin/recover-pin-popup.service';
import {ChangePinPopupService} from '../../../change-pin/change-pin-popup.service';
import {AgeRatings} from "../../../models/age-ratings";
import swal from "sweetalert2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-parental',
  templateUrl: './parental.component.html'
})
export class ParentalComponent implements OnInit {

  parentalCtrlOn = false;

  ratings: AgeRatings;
  askforPin: boolean = false;
  parentalPin: string = '';
  hasChanged: boolean = false;
  lastRule: string = '';
  messages: string = '';
  showPassword: boolean = false;
  showPasswordOld: boolean = false;
  showPasswordNew: boolean = false;
  opError: boolean = false; // For parental pin operation messages

  /* For updating the parental pin */
  showChangeModal: boolean = false;
  oldPin: string = '';
  newPin: string = '';
  updateOpError: boolean = false;        // For changing classes in the messages div
  updateMessages: string = '';

  constructor(public globals: GlobalsService,
              private popup: ParentalPopupService,
              private parentalService: ParentalService,
              private recoverPinSrv: RecoverPinPopupService,
              private changePinSrv: ChangePinPopupService,
              private router: Router)
  {
    parentalService.ageRatings.subscribe(value => {
      this.ratings = value;
    });

    parentalService.setParentalResponse.subscribe(value => {
      if (value.hasOwnProperty('data')) {
        this.opError = false;
        this.messages= value.data.description;
      }

      if (value.hasOwnProperty('error')) {
        this.opError = true;
        this.messages= value.error.description;
      }

    });

    parentalService.updateParentalPinResponse.subscribe(value => {
      if (value.hasOwnProperty('data')) {
        this.updateOpError = false;
        this.updateMessages = value.data.msg;
      }

      if (value.hasOwnProperty('error')) {
        this.updateOpError = true;
        this.updateMessages = value.error.description;
      }
    });

    parentalService.recoverParentalPinResponse.subscribe(value => {
      if (value.hasOwnProperty('data')) {
        swal({
          type: 'success',
          html:  '<span style="color: #fff; font-size: 16px;">'+value.data.description+'</span>',
          background: '#2a292a'
        });
      }

      if (value.hasOwnProperty('error')) {
        swal({
            type: 'error',
            title: '<span style="color: #fff;  font-size: 16px;" class="title">'+this.globals.strings.GENERAL_ERROR+'</span>',
            html:  '<span style="color: #fff;  font-size: 16px;">'+value.error.description+'</span>',
            background: '#2a292a'
          }
        );
      }
    });
  }

  ngOnInit() {
    this.parentalService.getAgeRatings();

    // Check the current parental status for the currently chosen profile
    this.parentalCtrlOn = this.globals.currProfile.parental_controls.enabled === 1 ? true: false;

    // Get the current setting for this profile
    this.lastRule = this.globals.currProfile.parental_controls.setting.id;
  }



  toggleParentalCtrl() {
    this.parentalCtrlOn = !this.parentalCtrlOn;
    this.globals.currProfile.parental_controls.enabled = this.parentalCtrlOn===true ? 1 : 0;
    this.hasChanged = true;
  }

  /**
   * Change the current age rating
   * @param {string} id
   */
  changeRating(id: string) {
    if (id!==this.lastRule)
      this.hasChanged = true;

    this.lastRule = id;
  }


  askForPin() {
    this.askforPin = true;
  }

  verifyPin() {
    let isLegit = true;

    // Digits only
    for (let i = 0; i < this.parentalPin.length; i++) {
      let c = this.parentalPin[i];
      if (c >= '0' && c <= '9') { /* ok */ }
      else {
        isLegit = false;
        break;
      }
    }

    if (this.parentalPin.length !== 4 || !isLegit) {
      this.opError = true;
      this.messages = this.globals.strings.ERROR_PIN_SHORT;
      return;
    }

    // clear messages
    this.messages = '';

    // Check if the parental control is disabled. We must send a setting of 0 to disable it
    if (!this.parentalCtrlOn)
      this.lastRule = '0';

    this.parentalService.setParentalControl(this.lastRule, this.parentalPin);
  }

  verifyChangePin() {
    let isLegit = true;

    // Digits only
    for (let i = 0; i < this.oldPin.length; i++) {
      let c = this.oldPin[i];
      if (c >= '0' && c <= '9') { /* ok */ }
      else {
        isLegit = false;
        break;
      }
    }

    for (let i = 0; i < this.newPin.length; i++) {
      let c = this.newPin[i];
      if (c >= '0' && c <= '9') { /* ok */ }
      else {
        isLegit = false;
        break;
      }
    }

    if (this.oldPin.length !== 4 || this.newPin.length !==4 || !isLegit) {
      this.updateOpError = true;
      this.updateMessages = this.globals.strings.ERROR_PIN_SHORT;
      return;
    }

    // clear messages
    this.updateMessages = '';

    // Check if the parental control is disabled. We must send a setting of 0 to disable it
    if (!this.parentalCtrlOn)
      this.lastRule = '0';

    this.parentalService.changeParentalPin(this.oldPin, this.newPin);
  }


  changePin() {
    this.showChangeModal = true;
  }

  recoverPin() {
    swal({
        title: '<span style="color: #fff; font-size: 16px;">'+this.globals.strings.BUTTON_RECOVER_PIN+'</span>',
        html: '<span style="color: #fff; font-size: 16px;">'+this.globals.strings.INFO_PIN_RECOVER+'</span>',
        type: 'warning',
        confirmButtonText: this.globals.strings.BUTTON_CONFIRM,
        background: '#2a292a'
      }
    ).then(result => {
      if (result.value) {
        this.parentalService.recoverParentalPin();
      }
    });
  }

  toggleEye() {
    this.showPassword = !this.showPassword;
  }

  toggleEyeOld() {
    this.showPasswordOld = !this.showPasswordOld;
  }

  toggleEyeNew() {
    this.showPasswordNew = !this.showPasswordNew;
  }

  crumbClick(waytoGo: string) {
      this.router.navigate([waytoGo]);
  }
}
