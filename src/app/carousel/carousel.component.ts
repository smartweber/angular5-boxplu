import {Component, Input, Output, ElementRef, NgZone, EventEmitter, HostListener} from '@angular/core';
import { OnInit, AfterViewInit, OnChanges, SimpleChanges } from "@angular/core";
import {Widget} from '../models/widget';
import {Content} from '../models/content';
import {PlaylistService} from '../models/playlist.service';
import * as $ from 'jquery';
import 'slick-carousel/slick/slick';
import {DetailsService} from "../details/details.service";

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html'
})


export class CarouselComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data: any;            //The input data for the carousel component
  @Input() isSeasons: boolean;      //Indicates that this is a "seasons" carousel

/*
    @HostListener('window:resize') onResize() {
      console.log("Rui TEste resize");
        if (this.$itemImage!=undefined) {
            this.carrHeight = this.$itemImage.clientHeight+2*this.$itemImage.parentElement.parentElement.clientTop;
            this.$carousel.height(this.carrHeight+'px');
        }
    }
*/

  // Elements that the carousel uses of input parameter <data>:
  // data.playlist.contents[]                 o--> array of elements that go into the carousel
  // data.image.url                           o--> if images are used, then this is their url string
  // data.layout.columns                      o--> the carousel's number of columns
  // data.layout.move_after_behaviour         o--> if centered the carousel will be centered
  // data.layout.assets_format_ratio          o--> aspect ratio of the image
  // data.layout.image_resize_type            o--> if 'crop' then cropped, otherwise resized
  // data.layout.presentation_order           o--> 'RTL' or 'LTR'
  // data.layout.layout_type                  o--> if 'loop_carousel' then carousel parameter 'infinite' is true
  // data.layout.animation_transition_speed   o--> 'speed' parameter of the carousel
  // data.layout.pagination_indicator         o--> 'dots' parameter of the carousel
  // data.layout.show_elements_title          o--> 'none' in order not to show
  // data.layout.element_vertical_spacing     o-->
  // data.layout.element_horizontal_spacing   o-->
  // data.layout.metadata_position            o-->
  // data.layout.show_elements_favorite        -->
  // data.layout.style                         -->

  // OPTIONALLY IF «data.playlist.contents[0].view» exists, then extra functionality is activated
  // The above elements with:  o-->  must be set (possibly empty)
  // Extra Functionality:
  // data.playlist.contents[].view.type        --> 'text' for text-display, 'image' for image-display
  // data.playlist.contents[].view.text        --> text to display
  // data.playlist.contents[].view.selected    --> true if to apply highlight class
  // data.playlist.contents[].view.callback    --> callback function defined in parent component.
  // data.playlist.contents[].view.param:      --> 1st parameter to be passed to the carousel's parent
  // data.id                                   --> 2nd parameter to be passed to the carousel's parent



  step: number;                     //Defines the difference of number of slides between resolution breaks
  id: string;                       //The ID of the carousel in the DOM
  pagesLoaded: number = 1;          //Pagination pages loaded. Starts at 1, since 1 page is always loaded
  breakpoints: Array<number>;       //Screen width's at which the carousel changes settings and number of slides
  // showCarousel: boolean = false;    //Indicates that the carousel is ready to show on the page
  initialized = false;
  $carousel: JQuery | any;
  $itemImage: JQuery | any;
  slides: any[]=[];
  config: any;
  selectedSlide: number;
  numSlides: number=0;
  extraFun: boolean;        // Whether this is a carousel with extra functionality, if not no slides should be
  carrHeight: number = 0;     // altura da imagem (quando existe) do carrousel
RuiTeste: string = "111px";
  constructor(private service: PlaylistService,
              private serviceDetail: DetailsService,
              private elem: ElementRef, private zone: NgZone) {
  }

  /**
   * Used on the ngFor directive for tracking purposes
   * @param index
   * @param element
   * @returns {number}
   */
  trackByContent(index: number, element: Content): number {
    return element.id;
  }

  ngAfterViewInit() {
    //This object will contain other objects with the structure slick.js
    //uses to set-up its responsive options
    //########## Slickj.js event binding ##########

//    this.$carousel.on('init', () => {
//      //This is so the carousel graciously appears on the page.
//      //It sets opacity to 1 and the opacity has a transition period
//      setTimeout(() => {
//        this.showCarousel = true;
//      }, 300);
//      console.log("Timer for slick onInit")
//    });

    //TODO finish pagination
    // $(this.id).on('beforeChange', ()=> {
    //   if(this.data.playlist.contents.length < this.data.playlist.pagination.total_size) {
    //     this.getNextPage(this.data.playlist.id, 2, ++this.pagesLoaded);
    //   }
    // });


    //this.$carousel.on('destroy', function(event, slick, currentSlide, nextSlide){
    //  console.log("Slick destroyed");
    //});
   // To adapt the positioning of the carousel items when they don't fill the row
      if (this.data && this.data.hasOwnProperty('layout')) {
          if (this.data.layout.move_after_behaviour=='left' || this.data.layout.move_after_behaviour=='when_needed' || this.data.layout.move_after_behaviour=='fixed')
              this.$carousel.find('.slick-track').addClass("alignLeft");
          if (this.data.layout.move_after_behaviour=='right')
              this.$carousel.find('.slick-track').addClass("alignRight");
      }

/*
      // When the page is refreshed no onload for the first image is triggered and the navigatiuon arrows must still be repositioned
      if(this.carrHeight > 0) {
          this.$carousel.find('.slick-arrow')[0].style.top=this.carrHeight/2+'px';
          this.$carousel.find('.slick-arrow')[1].style.top='10px';
      }
*/
    }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
      // only run when property "data" changed
      if (this.data && changes['data']) {
          //Sometimes the columns come in decimal values. Slick does not play well with that so we round it
          this.data.layout.columns = Math.round(this.data.layout.columns);
          //The step is 25% of the total number of columns for the highest resolution, so for a 8 column layout
          //the step would be 2, and we'd have 8 columns at the highest resolution, 6 on the one below it, 4 on the next one,
          //and 2 on the smallest resolution
          this.step = Math.round(this.data.layout.columns * 0.25);
          this.extraFun=this.data.playlist.contents[0].hasOwnProperty("view");
//          console.log("Rui in Carousel onInit");
//          console.log(this.data);
      }
  }

  /**
   * Fetches the next page of the carousel
   * @param id
   * @param limit
   * @param page
   */
  /*
  getNextPage(id: string, limit: number, page: number) {
    this.service.getPlaylist(id, limit, page)
      .subscribe(
        response => this.addSlides(response),
        error => console.log(error),
        () => {
        })
  }
  */


  /**
   * Adds the slides on newSlides to the carousel
   * @param newSlides
   */
  /*
  addSlides(newSlides: object) {
    for (let i in newSlides) {
      this.data.playlist.contents.push(newSlides[i]);
      this.$carousel.slick('slickAdd', newSlides[i].id);
    }
  }
  */

  calculateConfig(){
    let responsiveOptions: Array<object> = [];
    this.breakpoints = [5000, 1280, 768, 500, 0];
//    this.$carousel = '#carousel-' + this.data.playlist.id + '-' + this.data.playlist.slug + '-' + this.data.layout.id;

    //This to create the responsive options object for the slick config
    for (let i = 0; i < this.breakpoints.length; i++) {
      let obj: any = {};
      let currentNumberOfSlides = Math.round(this.data.layout.columns) - i * this.step;
      obj.breakpoint = this.breakpoints[i];
      obj.settings = {
        slidesToShow: currentNumberOfSlides > 0 ? currentNumberOfSlides : 1,
        slidesToScroll: currentNumberOfSlides > 0 ? currentNumberOfSlides : 1
      };
      responsiveOptions.push(obj);
    }
    //######### SlickJS configuration. Refer documentation for more info ########
    this.config = {
      'infinite': this.data.layout.layout_type == 'loop_carousel' || this.isSeasons,
      'speed': this.data.layout.animation_transition_speed,
      'rtl': this.data.layout.presentation_order == 'RTL',
      'dots': (this.data.layout.pagination_indicator=='none'?false:true),
      'lazyLoad': 'ondemand',
      'rows': 0,
      'responsive': responsiveOptions,
    };
  }

  initCarousel() {
    this.zone.runOutsideAngular(() => {
      this.calculateConfig();
      this.$carousel = $(this.elem.nativeElement).slick(this.config);
    });
  }

    /**
     * Adds the slide to the carousel
     * @param slide
     */
  addSlide(slide) {
    if (!this.initialized) // if carousel is not initialized, then initialize it
        this.initCarousel();
    this.slides.push(slide);
    if (this.extraFun && this.data.playlist.contents[this.numSlides].view.selected) {
        this.selectedSlide=this.data.playlist.contents[this.numSlides].id;    // With Extra functionality there is a slide that is selected
        $("#"+this.selectedSlide).toggleClass('highlight');
    }
    this.$carousel.slick('slickAdd', slide.el.nativeElement);
    this.initialized = true;
    this.numSlides++;
  }

  removeSlide(slide) {
    const idx = this.slides.indexOf(slide);
    this.$carousel.slick('slickRemove', idx);
    this.slides = this.slides.filter(s => s != slide);
  }

  /*
  getSeason(season: string) {
    //this.serviceDetail.getSeason(season,this.data.asset.id,this.data.screen.blocks[1].widgets[0].layout.id);
    this.serviceDetail.getSeason(season);
  }
  */

  onslickSlideClick(slideId:number){
    if (this.extraFun) {
      $("#"+this.selectedSlide).toggleClass('highlight');
      $("#"+slideId).toggleClass('highlight');
      this.selectedSlide=slideId;
    }
    this.$carousel.find('.slick-track').addClass("alignLeft");
  }
}
