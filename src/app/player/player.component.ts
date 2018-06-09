import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {GlobalsService} from '../globals.service';
import {LoadingService} from '../loading/loading.service';
import 'video.js/dist/video.min';
import 'videojs-contrib-hls/dist/videojs-contrib-hls.min';
import {PlayerService} from "./player.service";
import {Observable} from "rxjs/Observable";
import {animate, state, style, transition, trigger} from "@angular/animations";

declare var videojs: any;

declare function require(name:string);

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        //opacity: '1',
        overflow: 'hidden',
        height: '*'
      })),
      state('out', style({
        //opacity: '0',
        overflow: 'hidden',
        height: '0px'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})

export class PlayerComponent implements OnInit, OnDestroy {

  data: any;
  player: any;
  streamID: string;           // String ID coming from the asset's details
  streamURL: string;          // What we're trying to get! :P the stream's url from the asset's details
  streamType: string;         // AKA media type (mp4, etc..)
  mimeType: string;           // The stream's mimetype
  inactivityTimeout: any;     // Holds the inactivity timer for the mouse move event over the player area
  userActivity: boolean;      // Check if there's any user activity (mouse)
  activityCheck: any;         // Timer for periodically checking the mouse activity (default 250ms)
  barsState: string = 'out';  // For the bars animation

  constructor(private service: PlayerService,
              private route: ActivatedRoute,
              private router: Router,
              private globals: GlobalsService,
              private loading: LoadingService) {

    // obtaining route's params should preferably be done here ;)
    this.route.params
      .subscribe(params => {
        this.service.getAssetDetails(this.route.snapshot.params['id']);
      });
  }

  ngOnInit() {
    // Show we're doing some cool stuff in the background, like handing cookies :P
    this.loading.set(true);
    this.service.asset
      .subscribe(
        response => {
          this.data = response;

          // get the asset's video stream ID
          this.streamID = this.data.asset.video.streams.id;
          this.service.getStream(this.data.asset.id, this.streamID);
        });

    // get the stream data
    this.service.stream.subscribe(
      response => {
        this.streamURL = response.stream.url;


        // FIXME: API Should support this. In the meantime just determine the mimetype :P
        if (response.stream.MIMEType === "") {
          // Check if there are any query params coming with the url first
          let qCheck = this.streamURL.split('?');
          if (qCheck.length > 1) {
            this.streamType = qCheck[0].split('.').pop();
          }
          else {
            this.streamType = this.streamURL.split('.').pop();
          }
          let mime = require('mime-types');
          this.mimeType = mime.lookup(this.streamType);
        }
        else {
          this.mimeType = response.stream.MIMEType;
        }

        this.initializePlayer(this.streamURL, this.mimeType);
        this.loading.set(false);
      });
  }

  ngOnDestroy() {
    videojs('player').dispose();

    // Don't forget to clear the timers :P
    clearInterval(this.activityCheck);
    clearTimeout(this.inactivityTimeout);
  }

  initializePlayer(url:string, mimetype: string) {
    let self = this;
    this.player = videojs('player');
    this.player.src({
      src: url,
      type: mimetype,
      textTrackSettings: false,
      autoplay: true
    });

    // Things to do after the current media has finished
    this.player.on('ended', function() {
      self.videoEnd();
    });

    /**
     * Deal with mouse events so that we can show/hide the personalized bars
     * @Notes: check for mouse activity every 250ms and set an inactivity
     * timeout good for 2s
     */
    this.player.on('mousemove', function(){
      self.userActivity = true;
    });

    self.activityCheck = setInterval(function() {

      // Check to see if the mouse has been moved
      if (self.userActivity) {

        // Reset the activity tracker
        self.userActivity = false;

        self.barsState = 'in';

        // If the user state was inactive, set the state to active
        if (self.player.userActive() === false) {
          self.player.userActive(true);
        }

        // Clear any existing inactivity timeout to start the timer over
        clearTimeout(self.inactivityTimeout);

        // In X seconds, if no more activity has occurred
        // the user will be considered inactive
        self.inactivityTimeout = setTimeout(function() {
          // Protect against the case where the inactivity timeout can trigger
          // before the next user activity is picked up  by the
          // activityCheck loop.
          if (!self.userActivity) {
            self.player.userActive(false);
            self.barsState = 'out';
          }
          console.log('inactivityTimeout reached');
        }, 2000);
      }
    }, 250);

  }

  /**
   * Things to do after video has ended:
   * movie - go back to details page
   * series - go to next episode if available. if not back to details
   */
  videoEnd() {
    // Movies first (they're easier to deal with :P )
    if (this.data.asset.type=='movies') {
      this.returnToDetails();
    }

  }

  /**
   * Return to asset details when player 'back' btn is pressed
   */
  returnToDetails() {
    this.router.navigate(['movie/', this.route.snapshot.params['id']]);
  }


  openVideo() {

  }

}
