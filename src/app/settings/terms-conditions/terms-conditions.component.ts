import { Component, OnInit } from '@angular/core';
import { GlobalsService} from "../../globals.service";
import 'simplebar/dist/simplebar.js';
import { SettingsService} from "../settings.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
})
export class TermsConditionsComponent implements OnInit {
  hasBreadCrums = false;

  constructor( public globals: GlobalsService,
               public settingsService: SettingsService,
               private router: Router ) {  }

  ngOnInit() {
    this.hasBreadCrums = this.settingsService.getBreadCrums();
  }

  crumbClick(waytoGo: string) {
      this.router.navigate([waytoGo]);
  }
}
