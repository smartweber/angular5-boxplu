import { Component, OnInit } from '@angular/core';
import {GlobalsService} from "../../globals.service";
import 'simplebar/dist/simplebar.js';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {

  constructor( public globals: GlobalsService ) { }

  ngOnInit() {
  }

}
