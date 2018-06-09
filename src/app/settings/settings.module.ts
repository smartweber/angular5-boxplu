import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from "./settings.service";
import { SettingsComponent } from './settings.component';
import { LanguagesComponent } from './languages/languages.component';
import { LanguagesService} from "./languages/languages.service";
import {RouterModule} from '@angular/router';
import { MyAccountComponent } from './my-account/my-account.component';
import { EditProfileComponent } from './my-account/edit-profile/edit-profile.component';
import {FormsModule} from "@angular/forms";
import { PairingComponent } from "./my-account/pairing/pairing.component";
import { PairingService } from './my-account/pairing/pairing.service';
import {EditProfileService} from "./my-account/edit-profile/edit-profile.service";
import { MyAccountService} from "./my-account/my-account.service";
import { ChangePasswordComponent } from './my-account/change-password/change-password.component';
import { ChangePasswordPopupService} from "./my-account/change-password/change-password-popup-service";
import { ChangePasswordService} from "./my-account/change-password/change-password.service";
import { ParentalService} from "./my-account/parental/parental.service";
import { FaqComponent} from "./faq/faq.component";
import { TermsConditionsComponent} from "./terms-conditions/terms-conditions.component";
import { HelpComponent} from "./help/help.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    SettingsComponent
  ],
  declarations: [SettingsComponent,
    LanguagesComponent,
    MyAccountComponent,
    EditProfileComponent,
    PairingComponent,
    ChangePasswordComponent,
    FaqComponent,
    TermsConditionsComponent,
    HelpComponent],
  providers: [
    SettingsService,
    LanguagesService,
    PairingService,
    EditProfileService,
    MyAccountService,
    ChangePasswordPopupService,
    ChangePasswordService,
    ParentalService
  ]
})
export class SettingsModule { }
