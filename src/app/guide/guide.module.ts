import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {GuideComponent}   from './guide.component';
import {GuideService} from './guide.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GuideComponent
  ],
  exports: [
    GuideComponent
  ],
  providers: [
    GuideService,
  ]
})

export class GuideModule {
}
