import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {RegisterComponent}   from './register.component';
import {RegisterService} from './register.service';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    RegisterComponent
  ],
  exports: [
    RegisterComponent
  ],
  providers: [
    RegisterService
 ]
})

export class RegisterModule {
}
