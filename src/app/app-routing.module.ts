import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DetailsComponent} from './details/details.component';
import {MenuItemComponent} from './menu-item/menu-item.component';
import {PlayerComponent} from './player/player.component';
import {ViewAllComponent} from './view-all/view-all.component';
import {SearchComponent} from './search/search.component';
import {SessionsComponent} from "./sessions/sessions.component";
import {SubscriptionsComponent} from "./subscriptions/subscriptions.component";
import {PaymentsComponent} from "./payments/payments.component";
import {LanguagesComponent} from "./settings/languages/languages.component";
import {MyAccountComponent} from "./settings/my-account/my-account.component";
import {EditProfileComponent} from "./settings/my-account/edit-profile/edit-profile.component";
import {PairingComponent} from "./settings/my-account/pairing/pairing.component";
import {PricingComponent} from "./pricing/pricing.component";
import {TermsConditionsComponent} from "./settings/terms-conditions/terms-conditions.component";
import {HelpComponent} from "./settings/help/help.component";
import {FaqComponent} from "./settings/faq/faq.component";
import {ParentalComponent} from "./settings/my-account/parental/parental.component";


const routes: Routes = [
  {
    path: 'settings/terms-conditions',
    component: TermsConditionsComponent
  },
  {
    path: 'settings/help',
    component: HelpComponent
  },
  {
    path: 'settings/faq',
    component: FaqComponent
  },
  {
    path: 'pricing',
    component: PricingComponent
  },

  {
    path: 'payments/:payObject/:payObjectId',
    component: PaymentsComponent
  },
  {
    path: 'subscribe',
    component: SubscriptionsComponent
  },
  {
    path: 'sessions',
    component: SessionsComponent
  },
  {
    path: '',
    component: MenuItemComponent
  },
  {
    path: ':id',
    component: MenuItemComponent
  },
  {
    path: 'movie/:id',
    component: DetailsComponent
  },
  {
    path: 'play/:id',
    component: PlayerComponent
  },
  {
    path: 'tv-show/:id',
    component: DetailsComponent
  },
  {
    path: 'tv-show/:id/:season/:episode',
    component: DetailsComponent
  },
  {
    path: 'playlist/:id',
    component: ViewAllComponent
  },
  {
    path: 'search/:query',
    component: SearchComponent
  },

  {
    path: 'settings/languages',
    component: LanguagesComponent
  },
  {
    path: 'settings/my-account',
    component: MyAccountComponent
  },
  {
    path: 'settings/my-account/edit',
    component: EditProfileComponent
  },
  {
    path: 'settings/my-account/pairing',
    component: PairingComponent
  },
  {
    path: 'settings/my-account/parental-control',
    component: ParentalComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
