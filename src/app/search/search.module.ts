import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {SearchComponent}   from './search.component';
import {SearchService} from './search.service';
import {CarouselModule} from '../carousel/carousel.module';
import {ListingModule} from '../listing/listing.module';


@NgModule({
  imports: [
    CommonModule,
    CarouselModule,
    ListingModule
  ],
  declarations: [
    SearchComponent
  ],
  exports: [
    SearchComponent
  ],
  providers: [
    SearchService
  ]
})

export class SearchModule {
}
