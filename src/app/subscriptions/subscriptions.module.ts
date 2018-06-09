import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsComponent } from './subscriptions.component';

@NgModule({
  exports: [
    SubscriptionsComponent
  ],
  imports: [
    CommonModule
  ],
  declarations: [SubscriptionsComponent]
})
export class SubscriptionsModule { }
