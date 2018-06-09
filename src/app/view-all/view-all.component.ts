import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GlobalsService} from '../globals.service';
import {PlaylistService} from '../models/playlist.service';
import {LoadingService} from '../loading/loading.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html'
})

export class ViewAllComponent implements OnInit {

  data: any;                      // The playlist data
  id: string;                     // The playlist ID
  page: number = 1;               // Identifies the current page of the pagination
  contentLength: number;          // Total length of the playlist
  genres: any;                    // Stores the available genres for this playlist
  currentGenre: string;           // Indicates the currently selected genre

  constructor(private service: PlaylistService,
              private route: ActivatedRoute,
              private globals: GlobalsService,
              private loading: LoadingService,
              private location: Location) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.route.params
      .subscribe(params => {
        this.getPlaylist(this.route.snapshot.params['id']);
      });
  }

  /**
   * Gets the playlist data
   * @param id
   */
  getPlaylist(id: string, genre?: string) {
    this.loading.set(true);
    this.service.getPlaylist(id, 5, this.page, genre)
      .subscribe(
        response => {
          this.data = response;
          if(!this.genres) {
            this.genres = this.data.blocks[0].widgets[0].playlist.genres;
          }
          this.contentLength = this.data.blocks[0].widgets[0].playlist.pagination.total_size;
          this.globals.pageTitle = response.name;
          this.loading.set(false);
        },
        error => console.log(error))
  }

  /**
   * Gets the next elements of the currently selected playlist/genre
   */
  getNextPage() {
    this.loading.set(true);
    this.page++;
    this.service.getPlaylist(this.id, 5, this.page)
      .subscribe(
        response => {
          this.data.blocks[0].widgets[0].playlist.contents.push.apply(this.data.blocks[0].widgets[0].playlist.contents, response.blocks[0].widgets[0].playlist.contents);
          $('html,body').animate({scrollTop: document.body.scrollHeight},"medium");
        },
        error => console.log(error),
        () => {
          this.loading.set(false);
        })
  }

  /**
   * Filters the playlist according to a specific genre
   * @param genre
   */
  changeGenre(genre: string) {
    if(genre!=this.currentGenre) {
      this.currentGenre = genre;
      this.page = 1;
      this.getPlaylist(this.route.snapshot.params['id'], genre)
    }
  }

  goBack() {
    this.location.back();
  }


}
