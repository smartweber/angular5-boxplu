import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {ScreenComponent}   from './screen.component';
import {ScreenService} from './screen.service';
import {CarouselModule} from '../carousel/carousel.module';
import {ListingModule} from '../listing/listing.module';


@NgModule({
  imports: [
    CommonModule,
    CarouselModule,
    ListingModule,
  ],
  declarations: [
    ScreenComponent
  ],
  exports: [
    ScreenComponent
  ],
  providers: [
    ScreenService
  ]
})

export class ScreenModule {
}
