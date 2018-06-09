import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDrawerComponent } from './profile-drawer.component';
import {ProfileDrawerService} from "./profile-drawer.service";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ProfileDrawerComponent
  ],
  declarations: [ProfileDrawerComponent],
  providers: [
    ProfileDrawerService,
    ProfileDrawerComponent
  ]
})
export class ProfileDrawerModule { }
