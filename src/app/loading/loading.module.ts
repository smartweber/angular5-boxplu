import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {LoadingComponent}   from './loading.component';
import {LoadingService} from './loading.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LoadingComponent
  ],
  exports: [
    LoadingComponent
  ],
  providers: [
    LoadingService
  ]
})

export class LoadingModule {
}
