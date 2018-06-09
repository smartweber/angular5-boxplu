import {Component, OnInit, Input, ElementRef} from '@angular/core';
import {Layout} from '../models/layout';
import {UtilsService} from '../utils.service';
import {GlobalsService} from "../globals.service";
import * as $ from "jquery";

@Component({
  selector: 'app-playlist-element',
  templateUrl: './playlist-element.component.html'
})

export class PlaylistElementComponent implements OnInit {
  @Input() data: any;
  @Input() layout: Layout;
  @Input() showExtraInfo: boolean;
  extraFun: boolean;  // true if element data.view exists
  imageUrl: string;
  public placeholder: string;

  constructor( private utils: UtilsService, private globals: GlobalsService) {}

  ngOnInit() {

    this.placeholder  = this.utils.resizeImage(this.globals.API.slice(0,-4)+this.layout.element_placeholder_image, Math.round(1320 / this.layout.columns), this.layout.assets_format_ratio, 'fit');


    // New rules from the API dictate that the image may come with a resize type "fit" or "crop"
    this.data.image.url = this.utils.resizeImage(this.data.image.url, Math.round(1320 / this.layout.columns), this.layout.assets_format_ratio, this.layout.image_resize_type);
    this.imageUrl=this.data.image.url;
    this.extraFun=this.data.hasOwnProperty("view");
  }


  setNoImagePic() {
    this.imageUrl=this.globals.API.slice(0,-4)+'uploads/placeholder/placeholder.png';

  }

}

