import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SessionsService} from "./sessions.service";
import {SessionsComponent} from "./sessions.component";

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [SessionsComponent],
  declarations: [SessionsComponent],
  providers: [SessionsService]
})
export class SessionsModule { }
