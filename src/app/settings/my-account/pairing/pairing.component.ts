import { Component, OnInit } from '@angular/core';
import { PairingService} from "./pairing.service";
import { GlobalsService} from "../../../globals.service";

@Component({
  selector: 'app-pairing',
  templateUrl: './pairing.component.html'
})
export class PairingComponent implements OnInit {
  pairingCode: string;
  responded: boolean = false;
  message: string = '';
  constructor(
    public service: PairingService,
    public globals: GlobalsService
  ) {
    this.service.response.subscribe(value => {
      this.responded = true;
      this.message = value.error.description;
      // Apparently no action is needed when the response is valid, the API will take care of the rest(?)
    });
  }

  ngOnInit() {
  }

  onSubmit(){
    this.service.putPairing(this.pairingCode);
  }

}
