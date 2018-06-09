import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MenuItemService } from './menu-item.service';

@Injectable()
export class MenuItemResolve implements Resolve<any> {

  constructor(private service: MenuItemService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.service.getMenuItemById(route.params['id']);
  }
}
