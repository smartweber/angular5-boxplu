import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {ViewAllComponent}   from './view-all.component';
import {ViewAllService} from './view-all.service';
import {ViewAllResolve} from './view-all.resolve';
import {ListingModule} from '../listing/listing.module';


@NgModule({
  imports: [
    CommonModule,
    ListingModule
  ],
  declarations: [
    ViewAllComponent
  ],
  exports: [
    ViewAllComponent
  ],
  providers: [
    ViewAllService,
    ViewAllResolve
  ]
})

export class ViewAllModule {
}
