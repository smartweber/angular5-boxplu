import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuItem} from '../models/menu-item';
import {MenuItemService} from './menu-item.service';
import {GlobalsService} from '../globals.service';


@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html'
})

export class MenuItemComponent implements OnInit {

  data: MenuItem;

  constructor(
              private service: MenuItemService,
              private route: ActivatedRoute,
              public globals: GlobalsService
  ) {
    // Ensure that menuitems data automatically updates
    this.service.menuItem.subscribe(value => {
      this.data = value;
      this.getMenuItem();
    });

    // Update menuItem
    this.route.params.subscribe(params => {
      try {
          this.service.getMenuItemById(this.route.snapshot.params['id'] || this.globals.menu[0].id);
      }
      catch {      }

    });
  }

  ngOnInit() {  }

  getMenuItem() {
    let menuItem=this.data;
    this.globals.pageTitle = this.data.menu_option.name;
    this.globals.pageTitleSlug = this.data.menu_option.slug;
    if(this.data.menu_option.option_type=='screen') {
      for (let i in menuItem.screen.blocks) {
        menuItem.screen.blocks[i].selected = menuItem.screen.blocks[i].block_type != 'tab' && menuItem.screen.blocks[i].block_type != 'combobox';
      }
      this.data = menuItem;
    }
  }

}
