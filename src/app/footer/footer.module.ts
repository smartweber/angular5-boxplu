import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {FooterComponent}   from './footer.component';
import {FooterService} from './footer.service';
import {RouterModule} from "@angular/router";


@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    FooterComponent
  ],
  exports: [
    FooterComponent
  ],
  providers: [
    FooterService
  ]
})

export class FooterModule {
}
