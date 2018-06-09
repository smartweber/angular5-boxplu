import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {PlaylistElementComponent}   from './playlist-element.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports:      [
    CommonModule,
    RouterModule
  ],
  declarations: [
    PlaylistElementComponent
  ],
  exports:      [
    PlaylistElementComponent
  ],
  providers:    [

  ]
})

export class PlaylistElementModule {
}
