import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {LoginComponent}   from './login.component';
import {LoginService} from './login.service';
import {RouterModule} from '@angular/router';
/*import { FacebookService } from 'ngx-facebook';*/
import { SubscriptionsService} from "../subscriptions/subscriptions.service";
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    LoginComponent
  ],
  exports: [
    LoginComponent
  ],
  providers: [
    LoginService,
    /*FacebookService,*/
    SubscriptionsService
 ]
})

export class LoginModule {
}
