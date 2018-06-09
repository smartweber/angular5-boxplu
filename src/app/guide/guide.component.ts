import {Component, OnInit} from '@angular/core';
import {GuideService} from './guide.service';
import {GlobalsService} from '../globals.service';
import {Router} from '@angular/router';
import {LoadingService} from '../loading/loading.service';
import {EpgLayout} from '../models/epg-layout';
import {EpgChannel} from '../models/epg-channel';
import {Genre} from '../models/genre';
import {Scheduling} from '../models/scheduling';




import * as moment from 'moment';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  host: {
    '(window:resize)': 'onResize()'
  }
})

export class GuideComponent implements OnInit {

  data: Array<EpgChannel>;
  genres: Array<Genre> = [];
  layout: EpgLayout = new EpgLayout();
  errorMessage: string;
  currentShow: Scheduling = new Scheduling();
  selectedChannel: number = 0;
  currentChannel: EpgChannel = new EpgChannel();
  days: any = [];
  day: number = 0;
  epgOpacity: boolean = false;
  smallScreen: boolean = window.innerWidth < 768;
  epgPosition: number = 0;
  containerWidth: number = 0;
  screenWidth: number = 0;
  channelsPosition: number = 0;
  showingOptions: string = '';
  time: Array<string> = [];
  todayMs: number;
  nowMs: number;
  epgHeight: string;
  currentGenre: string = undefined;
  popup: boolean = false;

  // epgDragDistance: number = 70;

  constructor(private service: GuideService,
              private globals: GlobalsService,
              private router: Router,
              private loading: LoadingService
  ) {}

  ngOnInit() {
    this.globals.pageTitle = 'Live TV Guide';
    this.createTimeMarkers();

    //Gets the milliseconds since midnight so we know where the EPG starts
    let d: Date = new Date();
    let e: Date = new Date(d);
    this.epgPosition = -(+e - d.setHours(0, 0, 0, 0)) / 1000 / 60 * 4;

    //Little visual fix so that if EPG is too soon or too late
    //we prevent it leaving white space on one of the sides
    if (this.epgPosition < -438) {
      this.epgPosition += 438;
    }
    if (this.epgPosition > -438) {
      this.epgPosition = 0;
    }
    if (this.epgPosition < -4580) {
      this.epgPosition = -4580;
    }

    let today = new Date();
    today.setHours(0, 0, 0, 0);
    this.todayMs = today.getTime();
    this.nowMs = new Date().getTime();
    this.getGuide(this.todayMs, this.currentGenre);
  }


  /**
   * Callback for when the user resizes the window, which manages the EPG width
   */
  onResize() {
    let oldWidth = this.screenWidth;
    this.screenWidth = window.innerWidth;
    this.smallScreen = this.screenWidth < 768;
    this.containerWidth = document.getElementById('standard-epg-container').offsetWidth;
    if (this.screenWidth > oldWidth && this.epgPosition <= -4580) {
      this.epgPosition -= oldWidth - this.screenWidth;
    }
  }


  /**
   * Gets the EPG data and sets up the next necessary steps when a new batch of data is requested
   * @param {number} startTime
   * @param {genre} Genre of the channels
   */
  getGuide(startTime: number, genre: string) {
    this.loading.set(true);
    this.epgOpacity = true;

    //Start comes in ms but the API wants seconds, hence the / 1000
    this.service.getGuide(startTime / 1000, genre)
      .subscribe(
        response => {
          this.data = response.blocks[0].widgets[0].playlist.contents;
          if(!this.genres.length) {
            this.genres = response.blocks[0].widgets[0].playlist.genres;
          }
          this.layout = response.blocks[0].widgets[0].layout;
        },
        error => this.errorMessage = <any>error,
        () => {
          if(!this.days.length) {
            this.createDays(this.layout.number_days_backward, this.layout.number_days_forward);
          }
          this.containerWidth = document.getElementById('standard-epg-container').offsetWidth;
          this.epgHeight = (this.data.length * 44) - 4 + 'px';
          this.epgOpacity = false;
          this.parseData();
          this.currentChannel = this.data[0];
          this.getSelected();
          //Gets the show that is currently playing
          for (let i = 0; i < this.data[this.selectedChannel].scheduling.length; i++) {
            if (this.data[this.selectedChannel].scheduling[i].isPlaying) {
              this.currentShow = this.data[this.selectedChannel].scheduling[i];
              break;
            }
          }
          this.loading.set(false);
        });
  }


  /**
   * Converts a timestamp to human readable time
   * @param value
   * @returns {string}
   */
  static dateToTime(value) {
    value = new Date(value);
    let minutes = value.getMinutes();
    let hours = value.getHours();
    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);
  }


  /**
   * Parses the EPG data into a format the layout can use
   */
  parseData() {
    let timeNow = new Date().getTime() * 1000;
    this.data.forEach(value => {
      value.scheduling.forEach(value => {
        let start = new Date(value.start_time * 1000);
        let end = new Date(value.end_time * 1000);
        value.duration = end.getTime() - start.getTime();
        value.start_time_string = GuideComponent.dateToTime(start);
        value.end_time_string = GuideComponent.dateToTime(end);
        value.width = value.duration / 1000 / 60 * 4;
        value.left = ((value.start_time * 1000) - this.todayMs) / 1000 / 60 * 4;
        if (value.start_time * 1000 < timeNow && value.end_time * 1000 > timeNow) {
          value.isPlaying = true;
        }
      });
    });
  }


  /**
   * Created the days list that the EPG can have
   * @param {number} forward
   * @param {number} backward
   */
  createDays(backward, forward) {
    let daysBackward = [], daysForward = [];

    //First we create the days before the present day
    for (let i = backward; i > 0; i--) {
      let dayObj: any = {};
      dayObj.id = -i;
      dayObj.day = moment().add(-i, 'days').format("D");
      dayObj.weekday = moment().add(-i, 'days').format("ddd");
      dayObj.name = dayObj.weekday + ' ' + dayObj.day;
      dayObj.date = moment().add(-i, 'days').format("x");
      daysBackward.push(dayObj);
    }

    //Then we create the days from today up until the maximum allowed days
    for (let i = 0; i < forward; i++) {
      let dayObj: any = {};
      dayObj.id = i;
      dayObj.day = moment().add(i, 'days').format("D");
      dayObj.weekday = moment().add(i, 'days').format("ddd");
      dayObj.name = dayObj.weekday + ' ' + dayObj.day;
      dayObj.date = moment().add(i, 'days').format("x");
      daysForward.push(dayObj);
    }

    daysBackward[daysBackward.length - 1].name = 'Yesterday';
    daysForward[0].name = 'Today';
    daysForward[1].name = 'Tomorrow';

    this.days = daysBackward.concat(daysForward);
  }


  /**
   * Creates the time markers above the EPG
   */
  createTimeMarkers() {
    for (let i = 0; i < 24; i++) {
      this.time.push((i < 10 ? '0' + i : i) + ':' + '00');
      this.time.push((i < 10 ? '0' + i : i) + ':' + '30');
    }
  }


  /**
   * Changes the currently selected day
   * @param {number} day
   */
  selectDay(day) {
    this.day = day;

    //Get today's date
    let start = new Date();

    //Add the number of days we need (if we choose today, this variable comes as 0)
    start.setDate(start.getDate() + day);

    //Get the beginning and end of the day
    start.setHours(0, 0, 0, 0);

    //Get the timestamp
    let startMs = start.getTime();
    this.todayMs = startMs;

    //Get the EPG data for the new day
    this.getGuide(startMs, this.currentGenre);
  }


  /**
   * Sets the currently selected show and its respective channel
   * @param {Object} show
   * @param {Object} channel
   */
  selectShow(show, channel) {
    if (channel && channel.channel_number !== this.currentChannel.channel_number) {
      this.currentChannel = channel;
    }
    if(this.layout.show_selected_program_info=='popup') {
      this.popup=true;
    }
    this.currentShow = show;
    this.showingOptions = show.id == this.showingOptions ? '' : show.id;

  }


  /**
   * Changes the currently selected channel
   * @param {Object} channel
   */
  selectChannel(channel) {
    this.currentChannel = channel;
    //Gets the show that is currently playing
    for (let i = 0; i < this.currentChannel.scheduling.length; i++) {
      if (this.currentChannel.scheduling[i].isPlaying) {
        this.selectShow(this.currentChannel.scheduling[i], undefined);
        break;
      }
    }
  }


  /**
   * Verifies which show is currently playing in a given channel
   */
  getSelected() {
    if (this.day == 0) {
      let timeNow = new Date().getTime() / 1000;

      //Loop the channels
      this.data.forEach(channel => {
        for (let i in channel.scheduling) {
          channel.scheduling[i].isPlaying = false;
          if (channel.scheduling[i].start_time < timeNow && channel.scheduling[i].end_time > timeNow) {
            channel.scheduling[i].isPlaying = true;
            channel.nowPlaying = channel.scheduling[i];
            break;
          }
        }
      });
    }
  }


  /**
   * Defines the length of the inner span of each element
   * so that the text is never outside the user view
   * @param {Object} show
   * @returns {Object} styles
   */
  getTextPosition(show) {
    if (-show.left > this.epgPosition && -show.left < this.epgPosition + 1280) {
      let newLeft = -this.epgPosition - show.left;
      return {
        transform: 'translate3d(' + newLeft + 'px, 0, 0)',
        width: show.width - newLeft - 24 + 'px'
      }
    }
  }


  /**
   * Moves the EPG according to the navigation button that was pressed
   * @param {number} direction
   */
  moveEpg(direction) {
    let maxMove = 4580;
    if (this.containerWidth < 1280 && this.epgPosition <= -4580) {
      maxMove += 1280 - this.containerWidth;
    }
    switch (direction) {
      case 1:
        this.epgPosition - 229 > -maxMove ? this.epgPosition -= 229 : this.epgPosition = -maxMove;
        break;
      case 2:
        this.epgPosition + 229 < 0 ? this.epgPosition += 229 : this.epgPosition = 0;
        break;
    }
  }


  /**
   * Filters the EPG according to a specific genre
   * @param genre
   */
  changeGenre(genre: string) {
    if(genre!=this.currentGenre) {
      this.currentGenre = genre;
      this.getGuide(this.todayMs, genre)
    }
  }

  // /**
  //  *
  //  * @param event
  //  */
  // dragLeft(event) {
  //   event.preventDefault();
  //   let dragDistance = this.epgDragDistance * Math.abs(event.velocity);
  //   this.epgPosition - dragDistance > -4580 ? this.epgPosition -= dragDistance : this.epgPosition = -4580;
  // }
  //
  // /**
  //  *
  //  * @param event
  //  */
  // dragRight(event) {
  //   event.preventDefault();
  //   let dragDistance = this.epgDragDistance * Math.abs(event.velocity);
  //   this.epgPosition + dragDistance < 0 ? this.epgPosition += dragDistance : this.epgPosition = 0;
  // }


}
