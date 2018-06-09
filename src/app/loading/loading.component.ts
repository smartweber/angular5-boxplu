import {Component, OnInit} from '@angular/core';
import {LoadingService} from './loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html'
})

export class LoadingComponent implements OnInit {
  loading: boolean;

  constructor(
    private service: LoadingService
  ) {}

  ngAfterViewInit() {

  }

  ngOnInit() {
    this.service.loadingUpdated.subscribe(
      (loading: any) => {
        this.loading = this.service.get();
      }
    );
  }

}
