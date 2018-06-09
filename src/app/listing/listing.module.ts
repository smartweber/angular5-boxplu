import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {ListingComponent}   from './listing.component';
import {PlaylistElementModule} from '../playlist-element/playlist-element.module';
import {ListingService} from "./listing.service";
import {LoadingService} from "../loading/loading.service";


@NgModule({
  imports: [
    CommonModule,
    PlaylistElementModule
  ],
  declarations: [
    ListingComponent
  ],
  exports: [
    ListingComponent
  ],
  providers: [
    ListingService,
    LoadingService
  ]
})

export class ListingModule {
}
