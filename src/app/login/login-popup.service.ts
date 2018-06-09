import {Subject} from 'rxjs/Rx';

export class LoginPopupService{
  show:Subject<boolean> = new Subject();
}
