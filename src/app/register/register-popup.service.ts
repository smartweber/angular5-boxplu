import {Subject} from 'rxjs/Rx';

export class RegisterPopupService{
  show:Subject<boolean> = new Subject();
}
