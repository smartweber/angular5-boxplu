import {Component, OnInit} from '@angular/core';
import { GlobalsService} from '../globals.service';
import { SettingsService} from "../settings/settings.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})

export class FooterComponent implements OnInit {
  hasSubscriptions =  false;
  hasTermsConditions =  false;
  hasHelp = false;
  hasFaq = false;

  constructor( public globals: GlobalsService, public settingService: SettingsService ) {}

  ngOnInit() {
    if (this.globals.subscriptions !== undefined) {
      this.hasSubscriptions = true;
    }
    if (this.globals.settings.hasOwnProperty('terms_conditions_slug') && this.globals.settings.terms_conditions_slug !== '') {
      this.hasTermsConditions = true;
    }
    if (this.globals.settings.hasOwnProperty('help_slug') && this.globals.settings.help_slug !== '') {
      this.hasHelp = true;
    }
    if (this.globals.settings.hasOwnProperty('faq_slug') && this.globals.settings.faq_slug !== '') {
      this.hasFaq = true;
    }
  }

  onClick() {
    this.settingService.setBreadCrums(false);
  }
}
