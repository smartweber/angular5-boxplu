import {
  Component, OnInit, Input, SimpleChanges, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges
} from '@angular/core';
import {Widget} from '../models/widget';
import {Content} from '../models/content';
import {PlaylistService} from '../models/playlist.service';
import * as $ from 'jquery';
import 'slick-carousel/slick/slick';

/*
@Component({
  selector: 'app-carousel',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './carousel.component.html'
})

export class CarouselComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data: Widget;            //The input data for the carousel component
  @Input() isSeasons: boolean;      //Indicates that this is a "seasons" carousel
  @Input() RuiTeste: string;
  step: number;                     //Defines the difference of number of slides between resolution breaks
  id: string;                       //The ID of the carousel in the DOM
  pagesLoaded: number = 1;          //Pagination pages loaded. Starts at 1, since 1 page is always loaded
  breakpoints: Array<number>;       //Screen width's at which the carousel changes settings and number of slides
  showCarousel: boolean = false;    //Indicates that the carousel is ready to show on the page
  RuidataLoaded = true;

  constructor(private service: PlaylistService,
              private ref: ChangeDetectorRef) {
  }

  //
   // Used on the ngFor directive for tracking purposes
   // @param element
   // @returns {number}
   //
  trackByContent(index: number, element: Content): number {
    return element.id;
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      if (propName === 'RuiTeste') {
        console.log('Inside onChanges - Carousel component')
        $(this.id).slick('unslick').slick('reinit');
        //$(this.id).slick('unslick');
        //$('.my-slide').remove();
        //$(this.id).slick({infinite: true,slidesToShow: 3,slidesToScroll: 1});
        //this.addSlides(this.data.playlist.contents);
      }
    }
  }

  ngAfterViewInit() {
    //This object will contain other objects with the structure slick.js
    //uses to set-up its responsive options
    //$(this.id).slick('destroy');
    console.log('Carousel ngAfterViewInit()');
    let responsiveOptions: Array<object> = [];
    this.breakpoints = [5000, 1280, 768, 500, 0];
    this.id = '#carousel-' + this.data.playlist.id + '-' + this.data.playlist.slug + '-' + this.data.layout.id;

    //This for created the responsive options object for the slick config
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


    //########## Slickj.js event binding ##########

    $(this.id).on('init', () => {
      //This is so the carousel graciously appears on the page.
      //It sets opacity to 1 and the opacity has a transition period
      setTimeout(() => {
        this.showCarousel = true;
      }, 300);
    });

    //TODO finish pagination
    // $(this.id).on('beforeChange', ()=> {
    //   if(this.data.playlist.contents.length < this.data.playlist.pagination.total_size) {
    //     this.getNextPage(this.data.playlist.id, 2, ++this.pagesLoaded);
    //   }
    // });
    //
    // if(this.data.playlist.contents.length < this.data.playlist.pagination.total_size) {
    //   this.getNextPage(this.data.playlist.id, 2, ++this.pagesLoaded);
    // }

    //######### SlickJS configuration. Refer documentation for more info ########
    // https://github.com/kenwheeler/slick

    $(this.id).slick(config);

    // Rui Stuff: To allow changing the playlist of this carousel, we initialize it here and then subscribe to the playlist
    //this.service.setPlayList(this.data);
    //this.service.playList.subscribe(res =>{
      //this.data=res;
      //this.addSlides(this.data.playlist.contents);
      //this.ref.markForCheck();
    //});
    //console.log("Carousel playList subscribed");
    $(this.id).on('destroy', function(event, slick, currentSlide, nextSlide){
      console.log("Slick destroyed");
    });

  }

  ngOnInit() {
    //Sometimes the columns come in decimal values. Slick does not play well with that so we round it
    this.data.layout.columns = Math.round(this.data.layout.columns);
    //The step is 25% of the total number of columns for the highest resolution, so for a 8 column layout
    //the step would be 2, and we'd have 8 columns at the highest resolution, 6 on the one below it, 4 on the next one,
    //and 2 on the smallest resolution
    this.step = Math.round(this.data.layout.columns * 0.25);
  }

  //ngAfterViewChecked() {
    //RuiTest
    //$(this.id).slick('refresh')
  //  console.log( "! checked after change !" );
  //  this.ref.detectChanges();

  //}

  //
   // Fetches the next page of the carousel
   // @param id
   // @param limit
   // @param page
   //
  getNextPage(id: string, limit: number, page: number) {
    this.service.getPlaylist(id, limit, page)
      .subscribe(
        response => this.addSlides(response),
        error => console.log(error),
        () => {
        })
  }

  //
  //  Adds the slides on newSlides to the carousel
  // @param newSlides
  //
  addSlides(newSlides: object) {
    for (let i in newSlides) {
      this.data.playlist.contents.push(newSlides[i]);
      $(this.id).slick('slickAdd', newSlides[i].id);
    }
  }

}

*/
