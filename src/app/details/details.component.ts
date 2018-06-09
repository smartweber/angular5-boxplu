import {Component, OnDestroy, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DetailsService} from './details.service';
import {GlobalsService} from '../globals.service';
import {LoadingService} from '../loading/loading.service';
import { ISubscription } from "rxjs/Subscription";
import swal from 'sweetalert2';
import 'slick-carousel/slick/slick';
import {Widget} from '../models/widget';
import {Content} from "../models/content";
import {Layout} from "../models/layout";
import {UtilsService} from "../utils.service";
import {PlaylistService} from "../models/playlist.service";
import index from "@angular/cli/lib/cli";
import {LoginService} from "../login/login.service"; // Incomplete as of 2018-2-1

@Component({
  selector: 'app-details',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './details.component.html'
})

/*
@Directive({
  selector: 'img[src]',
  host: {
    '[src]': 'checkPath(src)',
    '(error)': 'onError()'
  }
})
*/

export class DetailsComponent implements OnInit, OnDestroy {

  data: any;
  assetSlug: string;                    // Quick ref to the asset's id (actually it's the slug being passed)
  assetId: string;                      // Quick ref to the asset's id
  detailsTitle: string;                 // Holds the title to the details page (Movie, Episode, etc)
  layoutType: string;                   // Holds the layout type (details_page_X)
  assetType: string;                    // Holds the asset type (movies, series, ...)
  imageTemplate: string;                // defines the cover image to use in the details
  coverImage: string;                   // Url to the cover image
  providerImage: string;                // Url of the provider's image
  aspectRatio: number;                  // defines the aspect ratio to apply to the image above
  ratingPopUpVisible: boolean = false;
  rating: number = 0;                   // Holds the number of stars clicked
  hasTrailer: boolean = false;          // Whether to show "Play" (trailer) on top of the asset's image or not
  hasRelated: boolean = false;          // Whether to show the related list or not
  hasSeasons: boolean = false;          // Whether to show a series's list of seasons or not
  hasEpisodes: boolean = false;         // Whether we have a season's episode list or not
  seasonsList: any;                  // List of seasons
  episodesList: any;                 // Widget List of episodes
  relatedList: Widget;
  layout: Layout;
  relatedListPresentationOrder: string; // This defaults to LTR below...
  isFavourite: boolean = false;         // If this asset is a favorite
  isShared: boolean = false;            // This item is shared
  seasonLayoutType: string;             // How to display the seasons, either: enum: season_number, playlist or season_title
  assetRating: number = 0;              // Rating of the asset, if user is logged in then this is the rating of the user

  private rateSubscription: ISubscription;  // to subscribe, and then unsubscibe to rate.

  RuiTeste: boolean=false;
  Ruitmp: string;

  // Hack to make a broken heart (aka unfavourite :P )
  unFavouriteHtml = '<span class="fa-stack broken-heart">' +
    '<i class="fa fa-heart fa-stack-1x"></i>' +
    '<i class="fa fa-bolt fa-stack-1x fa-inverse"></i>' +
    '</span>';

  /* This determines what buttons are available to the user on the view  */
  userIsEntitled: boolean=false;
  entitlementsReady: boolean=false; // Whether the entitlements have been read

  constructor(private service: DetailsService,
              private router: Router,
              private route: ActivatedRoute,
              public globals: GlobalsService,
              private loading: LoadingService,
              private utils: UtilsService,
              private login: LoginService
             ) {

  }

  ngOnInit() {
    // Initialize data in case we're refreshing in order to avoid double "everything" :P
    this.data = [];

    // Subscribe to asset's entitlements
    this.service.entitlements.subscribe( value => {
        this.entitlementsReady = true;
        if (value.length > 0)
          this.userIsEntitled = true;
    });

    // Subscribe to is favorite check
    this.service.isFavourite.subscribe(value => {
        this.isFavourite = value;
    });

    this.route.params
      .subscribe(params => {
        this.assetSlug = params.id;
        this.getDetails(this.assetSlug);
      });
//    this.login.finishedLogin.subscribe(()=>{
//      this.globals.
//    })
    this.service.asset
      .subscribe(
        response => {
          this.data = response;
          

          // Check if the user rated this asset
          this.rateSubscription=this.service.assetUserRate.subscribe(val =>{
              // Have been given the indication that the rating is between 0 and 100
              this.assetRating=Math.round(val.data.rating/20);
          })
          if (this.globals.userLoggedIn)
            this.service.getmyRateAsset(this.data.asset.id);
          else
              this.assetRating = Math.round(this.data.asset.rating/20);;

          // If user logs in then get asset rating
          this.login.finishedLogin.subscribe(()=>{this.service.getmyRateAsset(this.data.asset.id)});

          this.layoutType = response.screen.layout.screen_type;
          this.assetType = response.asset.type;
          this.assetId = this.data.asset.id;
          // get entitlements for this asset (see notes on the service's function)
          if (this.globals.accountProfileToken!== '' && this.globals.accountProfileToken!==null)
              this.service.getEntitlements(this.assetId);
          else
            this.entitlementsReady = true;  // This is needed to trigger the showFullButton function

          /**
           * Check if this asset is already a favorite.
           * User must be logged in as this depends on the current profile.
           */
          if (this.globals.userLoggedIn) {
            this.service.getFavorite(this.data.asset.id);
          }

          // Determine the cover image to use
          this.imageTemplate = this.data.screen.layout.background.image_template;
          this.aspectRatio = this.data.screen.layout.image.aspect_ratio;
          if (this.data.asset.images[this.imageTemplate]!=undefined){
            this.coverImage = this.data.asset.images[this.imageTemplate].url;
          }
          this.providerImage=this.data.asset.video_provider.image_logo.url;



          //  Take care of image resizing
          //let resizeType = this.data.screen.blocks[0].widgets[0].layout.image_resize_type;
          //let formatRatio = this.data.screen.blocks[0].widgets[0].layout.assets_format_ratio;
          //this.coverImage = this.resizeImage(this.coverImage, 1320, formatRatio, resizeType);
          //this.coverImage = this.utils.resizeImage(this.coverImage,1320,1, 'fit');

          this.loading.set(false);

          // How to display the seasons and their episodes
          this.seasonLayoutType = this.data.screen.layout.season_selection_type;
          if(this.RuiTeste)
            this.seasonLayoutType='season_number';  // RuiTESTING: season_number, playlist or season_title
          // Set the details title
          switch (this.assetType) {
            case 'movies':
              this.detailsTitle = this.globals.strings.DETAILS_SCREEN_MOVIE_DETAILS;

              /**
               * Related content for Movies
               * test the existence (length) of blocks, widgets and contents first
               */
              if (this.data.screen.blocks.length > 0) {
                if (this.data.screen.blocks[0].widgets.length > 0) {
                  if (this.data.screen.blocks[0].widgets[0].playlist.contents.length > 0) {
                    this.hasRelated = true;
                    this.relatedList = this.data.screen.blocks[0].widgets[0];
                    this.relatedListPresentationOrder = this.relatedList.layout.presentation_order;
                    if (this.relatedListPresentationOrder === '' || this.relatedListPresentationOrder === null)
                      this.relatedListPresentationOrder = 'LTR';    // default
                  }
                }
              }
              break;
            case 'episodes':
              this.detailsTitle = this.globals.strings.DETAILS_SCREEN_EPISODE_DETAILS;
              break;
            case 'series':
              this.detailsTitle = this.globals.strings.DETAILS_SCREEN_SERIES_DETAILS;

              /**
               * Related content for series
               * block[0] - list of seasons
               * block[1] - list of episodes for season 1
               * block[2] - (optional) Related content
               */

              for (let block of this.data.screen.blocks) {
                // CHECKME: Only one widget per block (or so I've been told...)
                switch (block.widgets[0].playlist.type) {
                  case 'seasons':
                    this.hasSeasons = true;
                    this.seasonsList = block.widgets[0];
                    this.expandSeasonListContent(this.seasonsList.playlist.contents,this.seasonLayoutType);
                    break;

                  case 'episodes':
                    this.hasEpisodes = true;
                    this.episodesList = block.widgets[0];
                    break;

                  case 'related':
                    this.hasRelated = true;
                    this.relatedList = block.widgets[0];
                    this.relatedListPresentationOrder = this.relatedList.layout.presentation_order;
                    if (this.relatedListPresentationOrder === '' || this.relatedListPresentationOrder === null)
                      this.relatedListPresentationOrder = 'LTR';    // default
                    break;
                }
              }
              this.verifySeasonEpisodes();

              break;
            case 'seasons':
              this.detailsTitle = this.globals.strings.DETAILS_SCREEN_SEASON_DETAILS;
              break;
            default:
              // FIXME: hardcoded string
              this.detailsTitle = "Details";
              break;
          }

          // @Notes: Trailer isn't available in series/episodes yet.
          if (this.data.asset.hasOwnProperty('video') && this.data.asset.video.trailer) {
            // Show trailer ?
            if (this.data.asset.video.trailer.slug !== null)
              this.hasTrailer = true;
            else
              this.hasTrailer = false;

          }
        }
      );

    // Subscribe to view Episodes of selected Season
    this.service.Season.subscribe(res =>{
      this.episodesList.playlist.contents = res.data;
      this.verifySeasonEpisodes();
    });

    // Subscribe to favorites addition
    this.service.favoriteAdded.subscribe(val => {
      if (val === true) {
        swal({
            type: 'success',
            title: '<span style="color: #fff;" class="title">'+this.globals.strings.DETAILS_SCREEN_BUTTON_FAVOURITE+'</span>',
            html:  '<span style="color: #fff;">'+this.globals.strings.FAVORITE_ADD_SUCCESS+'</span>',
            background: '#2a292a'
          }
        );
      }
      else {
        // Failure to add favorite
        swal({
            type: 'error',
            title: '<span style="color: #fff;" class="title">'+this.globals.strings.SCREEN_ERROR_TITLE+'</span>',
            html:  '<span style="color: #fff;">'+this.globals.strings.GENERAL_ERROR+'</span>',
            background: '#2a292a'
          }
        );
      }

    });

  }

  ngOnDestroy() {
    //this.service.asset.unsubscribe(); // this raises an error?!
    this.rateSubscription.unsubscribe();  // must passhandle of subscription
  }

  /**
   * Get an asset's details
   * @param {string} id
   */
  getDetails(id: string) {
    this.loading.set(true);
    this.service.getAsset(id);
  }

  /**
   * Handle click on one of the "icon" buttons (favorite, share, ...)
   * @param {string} action
   */
  iconBtnClick(action: string) {
    // User must be logged in first in order to perform these ops
    if (!this.globals.userLoggedIn) {
      swal({
          type: 'warning',
          title: '<span style="color: #fff;" class="title">'+this.globals.strings.POPUP_SIGN_IN_REQUIRED_TITLE+'</span>',
          html:  '<span style="color: #fff;">'+this.globals.strings.POPUP_SIGN_IN_REQUIRED_BODY+'</span>',
          background: '#2a292a'
        }
      );
      return;
    }

    switch (action) {
      case 'favorite':
        // Ok ... bit shady approach ... but ... if it's already a favourite ... *un*favourite it :P
        if (!this.isFavourite)
          this.service.setFavorite(this.assetId); // *Must* be ID. Slug not supported.
        else
          this.service.unsetFavourite(this.assetId);
        break;

      case 'share':
        break;
    }

  }

  /**
   * Handle clicking on one of the "full" buttons (play, subscribe, share...)
   * @param {string} action
   */
  fullBtnClick(action: string) {
    // No matter what action user must be logged in first
    if (!this.globals.userLoggedIn && action!='more_info') {
      swal({
          type: 'warning',
          title: '<span style="color: #fff;" class="title">'+this.globals.strings.POPUP_SIGN_IN_REQUIRED_TITLE+'</span>',
          html:  '<span style="color: #fff;">'+this.globals.strings.POPUP_SIGN_IN_REQUIRED_BODY+'</span>',
          background: '#2a292a'
        }
      );
      return;
    }

    switch (action) {
      case 'share':
        // TODO
        break;
      case 'favorite':
        // TODO
        break;
      case 'play':
        if(this.hasSeasons) {
          // Play first episode first season
          this.playClicked(this.data.screen.blocks[1].widgets[0].playlist.contents[0].id,this.data.screen.blocks[1].widgets[0].playlist.contents[0].video.streams.url);
        } else
          this.playClicked(this.data.asset.id,this.data.asset.video.streams.url);
//          this.router.navigate(['/play', this.data.asset.id]);
        break;
      case 'subscribe':
        // TODO
        break;
      case 'more_info':
        // TODO
        break;
    }

  }

  /**
   * Convert minutes to Hh Mm
   * @param {string} minutes
   * @returns {string}
   */
  minutesToTime(minutes: string): string {
    let time = "";

    if(minutes == undefined)
      return time;
    let min = Number(minutes);
    let hours = Math.floor(min / 60);

    min = Math.floor(min % 60);

    if (hours > 0)
      time = String(hours)+'h ';

    time += String(min)+'m';
    return time;

  }

  /**
   * Get the country code for the age rating.
   * @Notes: First check if the user is logged in.
   * If so:
   *      from the currProfile->parental_controls->setting->country_code
   * If not:
   *      from globals->settings->default_age_rating_country_code
   * @returns {string}
   */
  getAgeRatingCC(): string {
    var countryCode = "";

    if (this.globals.currProfile!=null)
      countryCode = this.globals.currProfile.parental_controls.setting.country_code;
    else
      countryCode = this.globals.settings.default_age_rating_country_code;
    return countryCode;
  }

  /**
   * Get the asset's PGR
   * @Notes: uses country code to do so
   * @returns {string}
   */
  getAgeRating(): string {
    var countryCode = this.getAgeRatingCC();
    var ageRating = "N/A";

    if (Array.isArray(this.data.asset.age_rating)) {
      for (let entry of this.data.asset.age_rating) {
        if (entry.country_code == countryCode) {
          ageRating = entry.description;
          break;
        }
      }
    }
    return ageRating;
  }

  /**
   * Get the asset's rating in the form of stars (1-5)
   * @returns {string}
   */
  buildRating() : string {
    //console.log("Rui in buildRating: assetRating="+this.assetRating);
    let stars = "";
    for (var i=1; i<=5; i++) {
      if (this.assetRating >= i)
        stars+= '<i class="fa fa-star" aria-hidden="true"></i>';
      else
        stars+= '<i class="fa fa-star-o" aria-hidden="true"></i>';
    }
    //this.refresh=false;
    return stars;
  }


  /**
   * Concatenate the full buttons' html with their text
   * @param {string} html
   * @param {string} btn_text
   * @returns {string}
   */
  buildFullBtnHtml(html: string, btn_text: string) : string {
    return html + '   <span>'+btn_text+'</span>';
  }

  /**
   * Bring up a rating popup for the current asset
   */
  showRatingPopup() {
    // Make sure the user is logged in
    if (this.globals.accountProfileToken) {
        this.ratingPopUpVisible = true;
        this.rating=0;
    } else {
      // Show a warning dialog
      swal({
          type: 'warning',
          title: '<span style="color: #fff;" class="title">'+this.globals.strings.POPUP_SIGN_IN_REQUIRED_TITLE+'</span>',
          html:  '<span style="color: #fff;">'+this.globals.strings.POPUP_SIGN_IN_REQUIRED_BODY+'</span>',
          background: '#2a292a'
        }
      );
    }
  }

  /**
   * Rate an asset based on the number of given stars
   * @param {number} rating
   *
   * @Notes: the endpoint ONLY accepts IDs. No slugs!
   */
  rateAsset() {
    // Make sure the user is logged in

    this.ratingPopUpVisible = false;
    if (this.globals.accountProfileToken) {
        this.service.rateAsset(this.data.asset.id, 20 * this.rating);
    } else {
      // Show a warning dialog
      swal({
          type: 'warning',
          title: '<span style="color: #fff;" class="title">'+this.globals.strings.POPUP_SIGN_IN_REQUIRED_TITLE+'</span>',
          html:  '<span style="color: #fff;">'+this.globals.strings.POPUP_SIGN_IN_REQUIRED_BODY+'</span>',
          background: '#2a292a'
        }
      );
    }

  }

  starClick(nbrStars: number) {
    this.rating = nbrStars;
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

  /**
   * Resizes an image according to a set width and it's height ratio
   * @param url
   * @param width
   * @param ratio
   * @param resizeType - "fit" || "crop"
   * @returns {string}
   */
  resizeImage(url: string, width: number, ratio: number, resizeType: string) {
    if(url==undefined)
      return;
    // FIXME: forcing "crop" at this time. Modify whenever content comes with the right resizeType
    resizeType = "crop";
    let string = url.split('.');
    // FIXME: Also not observing aspect ratio coming from the api
    //string[string.length-2] += '-h'+Math.round(width*ratio)+'_w'+width + '_' + resizeType;
    string[string.length-2] += '-h317'+'_w'+width + '_' + resizeType;
    return string.join('.');
  }

  expandSeasonListContent(itemsList: any, type: string){
    let typeCarousel: string;
    let displayText: string;
    let i=0;
    let iniSlide: boolean;
    itemsList.forEach(element =>{
      switch (type) {
        case 'season_title':
          typeCarousel='text';
          //displayText=this.globals.strings.SEASON_NUMBER_TITLE +' '+this.data.screen.blocks[0].widgets[0].playlist.contents[i].season_number;
            displayText=this.data.screen.blocks[0].widgets[0].playlist.contents[i].name;
          break;
        case 'season_number':
          typeCarousel='text';
          displayText=this.data.screen.blocks[0].widgets[0].playlist.contents[i].season_number;
          break;
        case 'playlist':
          typeCarousel='image';
          displayText=this.globals.strings.SEASON_NUMBER_TITLE +' '+this.data.screen.blocks[0].widgets[0].playlist.contents[i].season_number;
          break;
      }
      iniSlide=false;
      if(i==0)
        iniSlide=true;
      // the 'view' element is constructed according to comments in carousel.components.ts
      element["view"]={type:typeCarousel,text:displayText,selected:iniSlide,callback:this.detailsCallback.bind(this),param:"Nada a declarar"};
      i++;
    })
  }

  verifySeasonEpisodes(){
    if(this.episodesList.playlist.contents.length==0){
      this.hasEpisodes=false;
    }else{
      this.hasEpisodes=true;
    }
  }

  detailsCallback(userVal:string, assetId: string){
    console.log(userVal);
    this.service.getSeason(assetId);
  }

  playClicked(playId: string, playUrl: string) {
    if (!this.globals.userLoggedIn) {
        swal({
                type: 'warning',
                title: '<span style="color: #fff;" class="title">'+this.globals.strings.POPUP_SIGN_IN_REQUIRED_TITLE+'</span>',
                html:  '<span style="color: #fff;">'+this.globals.strings.POPUP_SIGN_IN_REQUIRED_BODY+'</span>',
                background: '#2a292a'
            }
        );
        return;
    }
    // Going to check video_provider
    if (this.data.asset.video_provider.player_type == 'website' || this.data.asset.video_provider.player_type == 'deeplinking') {
      //window.location.href=playUrl;
      window.open(playUrl, '_blank');
    } else
      this.router.navigate(['/play', playId]);
  }

  setNoImageCover() {
    this.coverImage=this.globals.API.slice(0,-4)+'uploads/placeholder/placeholder.png';
  }
  setNoImageProv(){
    this.providerImage=this.globals.API.slice(0,-4)+'uploads/placeholder/placeholder.png';
  }

  episodeImg(imgUrl: string) {
      return imgUrl;
    //return this.utils.resizeImage(imgUrl,100,1, 'fit');  // resizing is now done in CSS
  }

  crumbClick(waytoGo: string) {
      this.router.navigate([waytoGo]);
  }

  showFullButtons(entitleReady: boolean, action: string) {
    if (!entitleReady)
      return false;
    if (!this.userIsEntitled)
      return true;
    if (this.userIsEntitled && action=='play')
      return true;
    return false;
  }
}
