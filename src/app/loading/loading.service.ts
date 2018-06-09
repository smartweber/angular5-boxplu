import {EventEmitter} from '@angular/core';

export class LoadingService {

  loading: boolean;
  loadingUpdated: EventEmitter<any> = new EventEmitter();

  set(loading: any) {
    this.loading = loading;
    this.loadingUpdated.emit(this.loading);
  }

  get() {
    return this.loading;
  }

}
