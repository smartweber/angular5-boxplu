import { Component, OnInit } from '@angular/core';
import {GlobalsService} from '../globals.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html'
})
export class SubscriptionsComponent implements OnInit {

  constructor(
    public globals: GlobalsService,
    private router: Router
  ) { }

  ngOnInit() { }

  /**
   * Handle choose button click
   * @param {string} planId
   */
  onChoose(planId: string) {
    // Use skipLocationChange to hide the parameters from the URL ... :P
    //this.router.navigate(['/payments', 'subscription', planId], { skipLocationChange: true });
    this.router.navigate(['/payments', 'subscription', planId]);
  }
}
