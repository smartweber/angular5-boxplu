import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ParentalComponent } from './parental.component';
import { ParentalPopupService} from './parental-popup.service';
import { ParentalService} from './parental.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ParentalComponent],
  providers: [ParentalPopupService, ParentalService],
  exports: [ParentalComponent]
})
export class ParentalModule { }
