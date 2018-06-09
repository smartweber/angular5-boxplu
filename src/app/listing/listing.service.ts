import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {APIDataResponse, GlobalsService} from "../globals.service";
import { Subject} from "rxjs/Subject";

@Injectable()
export class ListingService {
  nextData: Subject<any> = new Subject<any>();
  loading: Subject<any> = new Subject<any>();
  pageUrl: string;
  pagesLoaded: number;
  pageRequested: number;
  pageLimit: number;
  number_max_elements: number;
  allLoaded: boolean;

  constructor(  private http: HttpClient,  private globals: GlobalsService ) { }


  getNextPage(){
    if (this.allLoaded || this.pageRequested!=this.pagesLoaded+1)
      return;
    console.log("Going to load page:"+this.pageUrl+this.pagesLoaded);
    this.loading.next(true);
    this.pageRequested++;
    let headers = new HttpHeaders()
      .set('Accept-Language', this.globals.settings.default_language);
    this.http.get<APIDataResponse>(this.pageUrl+this.pagesLoaded, {headers: headers})
      .toPromise()
      .then(res => {
        this.nextData.next(res.data);
        if(res.data.length==0 || (this.pagesLoaded*this.pageLimit>=this.number_max_elements)) {
          this.allLoaded = true;
          this.loading.next(false);
          console.log("Finnished....");
        }
        this.pagesLoaded++;
      })
      .catch(function (error) {
        this.loading.next(false);
        console.error(error);
      });
  }

  setState(pageUrl:string,pagesLoaded:number,pagesRequested:number,allLoaded:boolean,pageLimit:number,numMaxElements:number){
    this.allLoaded=allLoaded;
    this.pageUrl=pageUrl;
    this.pagesLoaded=pagesLoaded;
    this.pageRequested=pagesRequested;
    this.pageLimit=pageLimit;
    this.number_max_elements=numMaxElements;
  }

  getState_pageLoaded():number {
    return this.pagesLoaded;
  }
  getState_pageRequested():number {
    return this.pageRequested;
  }
  getState_allLoaded():boolean {
    return this.allLoaded;
  }
}
