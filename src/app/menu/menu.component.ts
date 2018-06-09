import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {MenuService} from "./menu.service";
import {GlobalsService} from '../globals.service';
import {LoginPopupService} from '../login/login-popup.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfileDrawerService} from "../profile-drawer/profile-drawer.service";
import {LoadingService} from "../loading/loading.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})

export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {

  @HostListener('window:resize') onResize() {
    // guard against resize before view is rendered
    this.winWidth=window.innerWidth;
    this.winHeight=(window.innerHeight-110)+'px';
  }
  data: any;                  // Contains the menu items
  menuList: any = {};         // menuList constructed for the Carousel Component
  menuOpen: boolean = false;  // Defines if the menu drawer is open
  searchTerm: string;
  menuCustom: boolean = true; // If true the css will be specific for a customer (see _menu.scss)
  avatarImgUrl: string;

  winWidth: number;           // contains the window width
  winHeight: string;          // contains window height

  menuSubscriber: any;

  constructor(
    public globals: GlobalsService,
    private login: LoginPopupService,
    private router: Router,
    private route: ActivatedRoute,
    private profileDrawerService: ProfileDrawerService,
    private menuService: MenuService,
    private loading: LoadingService
  ) {
    // Ensure that menu data automatically updates, thus making the view "dirty" and refresh :P
    this.menuSubscriber = this.menuService.data.subscribe(value => {
      this.data = value;
      this.expandMenuListContent(); // To initialize the carousel menu

    });
  }

  ngOnInit() {
    // Get the default menu, thus filling 'data'
    this.menuService.getDefaultMenu();
    this.winWidth=window.innerWidth;
    this.winHeight=(window.innerHeight-110)+'px';
    this.avatarImgUrl=this.globals.currAvatar
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.menuSubscriber.unsubscribe();
  }

  ngAfterViewInit() {  }


  /**
   * @Notes: refitted the function to have different actions depending on the number
   * of user profiles. If multiple open the drawer else go directly to My Account
   */
  toggleProfilesDrawer() {
    // Show the profile drawer, indicating that it's still loading the list of profiles
    if (this.globals.userProfiles.length > 1)
      this.profileDrawerService.toggle();
    else
      this.router.navigate(['settings/my-account/edit']);
  }

  showLogin() {
    if (!this.globals.userLoggedIn)
      this.login.show.next(true);
  }

  /**
   * Opens and closes the menu and removes overflow if menu is open
   */
  toggleMenu() {
    //First we verify if the hamburger menu is being shown, instead of the top menu.
    //We do this by seeing if the resolution is lower than 768px (tabled width)
    if (this.winWidth < 768) {
      this.menuOpen = !this.menuOpen;
      //If the menu is open, we set the overflow to hidden so it is not possible to scroll the content
      if (this.menuOpen) {
        document.body.style.overflow = 'hidden';
      }
      else {
        document.body.style.overflow = 'auto';
      }
    }
    //Otherwise we just guarantee that the menu is "closed" so that if the
    //user re-sizes the window he won't suddenly have an open menu
    else {
      this.menuOpen = false;
    }
  }

    /**
     *
     */
    actionMenu(pageSlug: string) {
        this.toggleMenu();
        if ( this.globals.pageTitleSlug != pageSlug) {
            this.globals.pageTitleSlug = pageSlug;
            this.loading.set(true);
            this.router.navigate([pageSlug]);
        }
    }

  /**
   * Verifies if the current page corresponds to the menu item defined in @title
   * @param title
   * @returns {boolean}
   */
  isFocused(title: string) {
    return title == this.globals.pageTitle;
  }

  /**
   * Redirects the user to the search results page and clears the search box
   */
  search() {
    this.toggleMenu();
    this.router.navigate(['search', this.searchTerm])
      .then(nav => {
        console.log(nav); // true if navigation is successful
      }, err => {
        console.log(err) // when there's an error
      });
  }


  expandMenuListContent(){
    this.menuList["playlist"]={contents:{}};


    // Each content element will have an extra view element with all that is needed (text, wether selected, callback and parameters )
    // Run over this.data (content) and only include in MenuList those needed:
    this.data.forEach(el =>{
      if (el.name!=this.globals.strings.CONTENT_GROUP_BTN_FAVOURITES || this.globals.userLoggedIn) {
          //this.menuList.playlist.push({Rui:'oi'});
          //this.menuList.playlist.contents.push(el);
          //this.menuList.playlist.contents.push({name: el.name, slug: el.slug});
          //this.menuList.playlist.contents["view"];
          //this.menuList.playlist.contents.view.push({type:'text',text:el.name,selected:(el.slug==this.globals.pageTitleSlug?true:false),callback:this.menuCallback.bind(this),param:el.slug});
      }
    });
    this.menuList["layout"]={columns:9,                      move_after_behaviour:'right',
                             assets_format_ratio: 1,         image_resize_type:'',
                             presentation_order: 'LTR',      layout_type:'noloop',
                             animation_transition_speed: 3,  pagination_indicator: 'none',
                             show_elements_title: '',        element_vertical_spacing: 2,
                             element_horizontal_spacing: 1,  metadata_position: ''};
    this.menuList["id"]='';
    this.menuList["image"]={url:''};
  }

  menuCallback(userVal:string, assetId: string){
    this.actionMenu(userVal)
  }

}
