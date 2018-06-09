import { Component, OnInit } from '@angular/core';
import { SubscriptionsService} from '../subscriptions/subscriptions.service';
import { GlobalsService} from '../globals.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html'
})
export class PricingComponent implements OnInit {
  gotSubscriptions = false;
  colorPlan: any[] = [];

  constructor(
    public subscriptionService: SubscriptionsService,
    public globals: GlobalsService) { }

  ngOnInit() {
    this.colorPlan.push({textCol: '#07183e', bkCol: '#ffffff'},
    {textCol: '#ffffff', bkCol: '#c39d07'},
    {textCol: '#ffffff', bkCol: '#b2b2b2'},
    {textCol: '#ffffff', bkCol: '#f37a7a'},
    {textCol: '#ffffff', bkCol: '#9cc05e'});
    this.subscriptionService.getAllSubscriptions();
    this.subscriptionService.allSubscriptions.subscribe(value => {
      if (value.hasOwnProperty('data') && value.data.length > 0) {
          this.gotSubscriptions = true;
      }
    });
  }

}
