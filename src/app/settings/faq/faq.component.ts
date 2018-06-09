import { Component, OnInit } from '@angular/core';
import {GlobalsService} from "../../globals.service";
import 'simplebar/dist/simplebar.js';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html'
})
export class FaqComponent implements OnInit {

  constructor(  public globals: GlobalsService  ) {  }

  ngOnInit() {
  }

}


