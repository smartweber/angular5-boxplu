import {Input, AfterViewInit, Directive, ElementRef, Host, OnDestroy} from '@angular/core';
import {CarouselComponent} from "./carousel.component";

@Directive({
  selector: '[appSlickItem]'
})
export class SlickItemDirective implements OnDestroy, AfterViewInit {
  @Input() tcolor: string;  //RuiTest no input needed
  constructor(private el: ElementRef, @Host() private carousel: CarouselComponent) {
  }
  ngAfterViewInit() {
    this.carousel.addSlide(this);
  }
  ngOnDestroy() {
    this.carousel.removeSlide(this);
  }
}
