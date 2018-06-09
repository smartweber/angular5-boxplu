import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { DetailsService } from '../details/details.service';

@Injectable()
export class PlayerResolve implements Resolve<any> {

  constructor(private service: DetailsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.service.getAsset(route.params['id']);
  }
}
