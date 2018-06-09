import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {PlayerComponent}   from './player.component';
import {PlayerService} from "./player.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PlayerComponent
  ],
  exports: [
    PlayerComponent
  ],
  providers: [
    PlayerService
  ]
})

export class PlayerModule {
}
