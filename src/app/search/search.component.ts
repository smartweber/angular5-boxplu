import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
// import {Search} from '../models/search';
import {SearchService} from './search.service';
import {GlobalsService} from '../globals.service';
import {Block} from '../models/block';
import {LoadingService} from '../loading/loading.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})

export class SearchComponent implements OnInit {

  data: any;
  errorMessage: string;
  showNumb: number = 0;

  constructor(
    private service: SearchService,
    private route: ActivatedRoute,
    private globals: GlobalsService,
    private loading: LoadingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.getSearch(this.route.snapshot.params['query']);
      });
  }

  getSearch(query: string) {
    this.loading.set(true);
    this.service.search(query)
      .subscribe(
        response => {
          this.data = response;
          this.globals.pageTitle = "Search - " + this.route.snapshot.params['query'];
          this.prepareLayouts(this.data);
          this.loading.set(false);
          this.data.screen.blocks.forEach((itemBlk) => {
            itemBlk.widgets.forEach((item) => {
                this.showNumb+= item.playlist.contents.length;
            });
          });
        },
        error => this.errorMessage = <any>error,
        () => {
        })
  }

  private prepareLayouts(search: any) {
    for (let i in search.screen.blocks) {
      if (search.screen.blocks[i].block_type == 'tab' || search.screen.blocks[i].block_type == 'combobox') {
        search.screen.blocks[i].selected = false;
      }
      else {
        search.screen.blocks[i].selected = true;
      }
    }
    this.data = search;
  }

  viewAll(id: string) {
    this.router.navigate(['playlist', id]);
  }

  filter(block: any, index: number) {
    block.selected = index;
  }

}
