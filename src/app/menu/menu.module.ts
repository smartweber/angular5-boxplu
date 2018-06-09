import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {MenuComponent}   from './menu.component';
import {MenuService} from './menu.service';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {ProfileDrawerModule} from "../profile-drawer/profile-drawer.module";
import {CarouselModule} from '../carousel/carousel.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ProfileDrawerModule,
    CarouselModule
  ],
  declarations: [
    MenuComponent
  ],
  exports: [
    MenuComponent
  ],
  providers: [
    MenuService
 ]
})

export class MenuModule {
}
