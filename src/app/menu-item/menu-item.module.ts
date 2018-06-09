import {NgModule}           from '@angular/core';
import {CommonModule}       from '@angular/common';
import {MenuItemComponent}   from './menu-item.component';
import {MenuItemService} from './menu-item.service';
import {MenuItemResolve} from './menu-item.resolve';
import {CarouselModule} from '../carousel/carousel.module';
import {ListingModule} from '../listing/listing.module';
import {GuideModule} from '../guide/guide.module';
import {ScreenModule} from '../screen/screen.module';
import {SettingsModule} from '../settings/settings.module';

@NgModule({
  imports: [
    CommonModule,
    CarouselModule,
    ListingModule,
    GuideModule,
    ScreenModule,
    SettingsModule
  ],
  declarations: [
    MenuItemComponent
  ],
  exports: [
    MenuItemComponent
  ],
  providers: [
    MenuItemService,
    MenuItemResolve
  ]
})

export class MenuItemModule {
}
