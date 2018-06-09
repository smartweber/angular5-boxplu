import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsComponent } from './payments.component';
import {PaymentsService} from "./payments.service";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [PaymentsComponent],
  declarations: [PaymentsComponent],
  providers: [PaymentsService]
})
export class PaymentsModule { }
