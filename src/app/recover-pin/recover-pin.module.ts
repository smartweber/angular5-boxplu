import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecoverPinComponent } from './recover-pin.component';
import { RecoverPinPopupService} from './recover-pin-popup.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RecoverPinComponent],
  providers: [RecoverPinPopupService],
  exports: [RecoverPinComponent]
})
export class RecoverPinModule { }
