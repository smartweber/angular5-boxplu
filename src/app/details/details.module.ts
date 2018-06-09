import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {DetailsComponent}   from './details.component';
import {DetailsService} from './details.service';
import {DetailsResolve} from './details.resolve';
import {CarouselModule} from '../carousel/carousel.module';

@NgModule({
  imports: [
    CommonModule,
    CarouselModule
  ],
  declarations: [
    DetailsComponent
  ],
  exports: [
    DetailsComponent
  ],
  providers: [
    DetailsService,
    DetailsResolve
  ]
})

export class DetailsModule {
}
