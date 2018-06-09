import { Component, OnInit } from '@angular/core';
import {GlobalsService} from "../../globals.service";
import {LanguagesService} from "./languages.service";
import {MenuService} from "../../menu/menu.service";
import {MenuItemService} from "../../menu-item/menu-item.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  // LOL works without a selector! ... it automatically inserts a <ng-component> tag :P
  templateUrl: './languages.component.html',
})
export class LanguagesComponent implements OnInit {

  constructor(
    public globals: GlobalsService,
    private service: LanguagesService,
    private menuService: MenuService,
    private router: Router
  ) { }

  ngOnInit() {

    /*
     Subscribe to the gotStrings subject so that we know when the new strings are available
     */
    this.service.gotStrings.subscribe(value => {
      if (value===true) {
        this.menuService.getDefaultMenu();
      }
    });

  }

  /**
   * Checks if the current entry is selected by comparing with the default language
   * @param {string} lang
   * @returns {boolean}
   */
  isSelected(lang: string): boolean {
    return this.globals.settings.default_language === lang;
  }

  /**
   * Change the current language
   * @param {string} lang
   */
  chooseLang(lang: string) {
    this.service.getStrings(lang);
  }

    crumbClick(waytoGo: string) {
        this.router.navigate([waytoGo]);
    }

}
