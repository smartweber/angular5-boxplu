import {AfterViewInit, Component, Input, OnChanges} from '@angular/core';
import {Router} from '@angular/router';
import {GlobalsService} from "../globals.service";
import {LoadingService} from "../loading/loading.service";

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html'
})

export class ScreenComponent implements OnChanges {

  @Input() data: any;

  constructor( private router: Router,
               public globals: GlobalsService,
               private loading: LoadingService ) {}

  ngOnChanges() {
      this.loading.set(false);
  }


  viewAll(id: string) {
    this.router.navigate(['playlist', id]);
  }

  filter(block: any, index: number) {
    block.selected = index;
  }

}
