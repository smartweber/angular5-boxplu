import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChangePinComponent } from './change-pin.component';
import { ChangePinPopupService} from './change-pin-popup.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ChangePinComponent],
  providers: [ChangePinPopupService],
  exports: [ChangePinComponent]
})
export class ChangePinModule { }
