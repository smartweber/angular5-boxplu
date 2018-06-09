import {Component, OnInit, Input, AfterViewInit, ElementRef, OnDestroy} from '@angular/core';
import {PlaylistService} from '../models/playlist.service';
import {Content} from '../models/content';
import * as $ from "jquery";
import { GlobalsService} from "../globals.service";
import {ListingService} from "./listing.service";

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  host: {
    '(window:resize)': 'onResize($event)',
    '(window:scroll)': 'onScroll($event)',
  }
})

export class ListingComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: any;
  breakpoints: Array<number>;
  step: number;
  id: string;
  isLoading: boolean;
  colSize: string;
  responsiveOptions: Array<any> = [];
  showCarousel: boolean = false;

  constructor(
    private service: PlaylistService,
    private elem: ElementRef,
    private globals: GlobalsService,
    private listingService: ListingService
    ) {  }

  trackByContent(index: number, element: Content): number { return element.id; }

  onResize(event: any){
    this.getElementWidth(event.target.innerWidth);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.showCarousel = true;
    },300);

  }

  ngOnInit() {

    this.breakpoints = [5000, 1280, 768, 500];
    this.step = Math.floor(this.data.layout.columns * 0.25);

    for (let i = 0; i < this.breakpoints.length; i++) {
      let obj: any = {};
      let currentStep = this.data.layout.columns - i * this.step;
      obj.breakpoint = this.breakpoints[i];
      obj.settings = {
        slidesToShow: currentStep,
        slidesToScroll: currentStep
      };
      this.responsiveOptions.push(obj);
    }
    this.getElementWidth(window.innerWidth);

    //$('.endpageDiv').on('click',(e1,e2)=>{this.display_Cache()});
    //document.getElementById('endpageDivId').addEventListener("click", this.display_Cache.bind(this));

    let pageUrl='';
    let allLoaded=true;
    if (this.data.playlist.pagination.url.next!=null) {
      pageUrl=this.data.playlist.pagination.url.next.slice(0,this.data.playlist.pagination.url.next.length-1);
      allLoaded=false;
    }

    // check if data has been extended(cached):
    if (this.data.hasOwnProperty('extended'))
      this.listingService.setState(pageUrl,this.data.extended.pageloaded,this.data.extended.pagerequested,this.data.extended.allloaded,this.data.playlist.pagination.limit,this.data.layout.number_max_elements);
    else
      this.listingService.setState(pageUrl,2,3,allLoaded,this.data.playlist.pagination.limit,this.data.layout.number_max_elements);

    this.listingService.nextData.subscribe(val=>{ this.addSlides(val); })

    // Subscribe to the loading status of pageloading
    this.listingService.loading.subscribe((value => {
      this.isLoading = value;
    }));

  }

  ngOnDestroy(){
    // Since data is cached, on reentering this component we will need to know the sate of the cached data
    if (!this.data.hasOwnProperty('extended')) {
      this.data["extended"]={pagesloaded:this.listingService.getState_pageLoaded(),pagerequested: this.listingService.getState_pageRequested(),allloaded: this.listingService.getState_allLoaded()};
    } else {
      this.data.extended.pageloaded = this.listingService.getState_pageLoaded();
      this.data.extended.pagerequested = this.listingService.getState_pageRequested();
      this.data.extended.allloaded = this.listingService.getState_allLoaded();
    }
  }

  getElementWidth(width: number) {
    for(let i = this.responsiveOptions.length - 1; i >= 0 ; i--) {
      if(width <= this.responsiveOptions[i].breakpoint) {
        this.colSize = 100 / this.responsiveOptions[i].settings.slidesToShow + '%';
        break;
      }
    }
  }


  addSlides(newSlides: object) {
    for (let i in newSlides) {
      this.data.playlist.contents.push(newSlides[i]);
      $(this.id).slick('slickAdd', newSlides[i].id);
    }
    console.log("adding....");
  }

  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      // you're at the bottom of the page
      if (!this.isLoading)
          this.listingService.getNextPage();
    }
  }
}
