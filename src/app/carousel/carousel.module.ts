import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {CarouselComponent} from './carousel.component';
import {PlaylistElementModule} from '../playlist-element/playlist-element.module';
import { SlickItemDirective } from './slick-item.directive';

@NgModule({
  imports:      [
    CommonModule,
    PlaylistElementModule
  ],
  declarations: [
    CarouselComponent,
    SlickItemDirective
  ],
  exports:      [
    CarouselComponent
  ],
  providers:    [

  ]
})

export class CarouselModule {
}
