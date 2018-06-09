import {Subject} from 'rxjs/Rx';

export class ChangePasswordPopupService{
  show:Subject<boolean> = new Subject();
}
