import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ConfigService} from './config.service';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {GlobalsService} from './globals.service';
import {UtilsService} from './utils.service';
import {MenuModule} from './menu/menu.module';
import {FooterModule} from './footer/footer.module';
import {MenuItemModule} from './menu-item/menu-item.module';
import {ScreenModule} from './screen/screen.module';
import {DetailsModule} from './details/details.module';
import {ViewAllModule} from './view-all/view-all.module';
import {PlaylistElementModule} from './playlist-element/playlist-element.module';
import {PlayerModule} from './player/player.module';
import {CarouselModule} from './carousel/carousel.module';
import {ListingModule} from './listing/listing.module';
import {GuideModule} from './guide/guide.module';
import {LoadingModule} from './loading/loading.module';
import {SearchModule} from './search/search.module';
import {LoginModule} from './login/login.module';
import {LoginPopupService} from './login/login-popup.service';
import {RegisterModule} from './register/register.module';
import {RegisterPopupService} from './register/register-popup.service';
import {SelectBoxModule} from './select-box/select-box.module';
import {PlaylistService} from './models/playlist.service';
import {UserModule} from './user/user.module';
import {UserService} from './user/user.service';
import {ProfileDrawerModule} from './profile-drawer/profile-drawer.module';
import {ProfileDrawerService} from './profile-drawer/profile-drawer.service';
import {ParentalModule} from './settings/my-account/parental/parental.module';
import {RecoverPinModule} from './recover-pin/recover-pin.module';
import {ChangePinModule} from './change-pin/change-pin.module';
import {SessionsModule} from "./sessions/sessions.module";
import {SubscriptionsModule} from "./subscriptions/subscriptions.module";
import {PaymentsModule} from "./payments/payments.module";
import {SettingsModule} from "./settings/settings.module";
import {PricingModule} from "./pricing/pricing.module";
import {LoadingService} from "./loading/loading.service";
import {MenuService} from "./menu/menu.service";
import {ActivatedRoute, Router} from "@angular/router";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    DetailsModule,
    CarouselModule,
    ListingModule,
    PlaylistElementModule,
    FooterModule,
    LoadingModule,
    SearchModule,
    GuideModule,
    MenuModule,
    LoginModule,
    RegisterModule,
    MenuItemModule,
    ScreenModule,
    PlayerModule,
    ViewAllModule,
    SelectBoxModule,
    UserModule,
    BrowserAnimationsModule,
    ProfileDrawerModule,
    ParentalModule,
    RecoverPinModule,
    ChangePinModule,
    SessionsModule,
    SubscriptionsModule,
    PaymentsModule,
    SettingsModule,
    PricingModule
  ],
  providers: [
    GlobalsService,
    UtilsService,
    PlaylistService,
    ConfigService,
    LoginPopupService,
    RegisterPopupService,
    {
      provide: APP_INITIALIZER,
      useFactory: configServiceFactory,
      deps: [ConfigService],
      multi: true
    },
    UserService,
    ProfileDrawerService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}

export function configServiceFactory(config: ConfigService) {
  return () => config.load();
}
