import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Rx';

@Injectable()
export class RecoverPinPopupService {
  show: Subject<boolean> = new Subject();

  constructor() { }
}
