import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ViewAllService } from './view-all.service';

@Injectable()
export class ViewAllResolve implements Resolve<any> {

  constructor(private service: ViewAllService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.service.getPlaylistById(route.params['id']);
  }
}
