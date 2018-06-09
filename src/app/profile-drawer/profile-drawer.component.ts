import {Component, OnDestroy, OnInit} from '@angular/core';
import {APIDataResponse, GlobalsService} from '../globals.service';
import {ProfileDrawerService} from "./profile-drawer.service";
import {profileDrawerAnimation} from "../_animations/profile-drawer.animation";
import swal from 'sweetalert2';
import {HttpClient, HttpParams} from "@angular/common/http";
import {LoginService} from "../login/login.service"; // For logout
import {Router} from '@angular/router';

@Component({
  selector: 'profile-drawer',
  templateUrl: './profile-drawer.component.html',
  animations: [profileDrawerAnimation]
})

export class ProfileDrawerComponent implements OnInit, OnDestroy {

  visible: boolean = false;           // Determines whether the profile drawer is opened or closed
  loading: boolean = false;           // Show a spinner while the profiles are loading.
  addModalVisible: boolean = false;   // Whether we show the add profile or not
  avatarsListGrouped: any [];         // Grouping the avatar images by 4 so that they fit nicely on a table
  opMsgs: string = null;              // For presenting success/error messages in the add profile modal
  private maxAvatars: string = "12";  // Maximum number of avatar to fetch from the API
  private groupBy: number = 4;         // Modify this to show a different number per row


  constructor(
    private profileDrawerService: ProfileDrawerService,
    private loginService: LoginService,
    public globals: GlobalsService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    // Subscribe to the visibility status of the profile drawer
    this.profileDrawerService.visible.subscribe((value => {
      this.visible = value;
      // If the drawer is opening start reading the profiles list
      if (this.visible) {
        console.log("Loading Profiles...");
        this.loadAllProfiles();
        // TODO: run a sliding animation to show the drawer
      }
      else {
        // TODO: run a sliding animation to hide the drawer
      }

    }));

    // Subscribe to the loading status of the profiles list
    this.profileDrawerService.loading.subscribe((value => {
      this.loading = value;
    }));

    // Subscribe to the finished status of the logout process
    this.loginService.finishedLogout.subscribe(value => {
      this.globals.userLoggedIn = false;
      this.globals.accountToken = null;
      this.globals.accountProfileToken = null;
      this.globals.userProfiles = [];
      this.globals.currProfile = null;
      // Finally hide the profile drawer
      this.visible = false;
    });

  }

  /**
   * Read all the user's profiles into globals.userProfiles[]
   */
  loadAllProfiles() {
    this.profileDrawerService.readAllProfiles();
  }

  /**
   * Make the selected profile the current one
   * @param {string} token
   */
  selectProfile(token: string) {
    this.globals.accountProfileToken = token;

    this.globals.userProfiles.forEach((element) => {
      if (element.token === token) {
        this.globals.currProfile = element;
        this.globals.currAvatar = element.avatar.url;
      }
    });
  }

  /**
   * Edit a profile with a given token
   * @param {string} token
   */
  editProfile(token: string) {
    console.log("Editing profile with token ["+token+"]");
    this.profileDrawerService.readProfileDetails(token);

    // TODO: this should call a modal for modifying the profile's info
  }

  /**
   * Add a profile
   * @Notes: check if we haven't reached the maximum amount of allowed profiles...
   */
  addProfile() {
    let maxProfiles = this.globals.settings.profiles_limit;
    /*
    if (this.globals.userProfiles.length < maxProfiles) {
      this.loadAvatars();

     this.addModalVisible = true;
    }
    else {
      swal({
          type: 'warning',
          html:'<span style="color: #fff;">'+this.globals.strings.CREATE_PROFILE_MAX_NUMBER_MSG+'</span>',
          background: '#2a292a'
        }
      );
      return;
    }
    */
  }

  /**
   * delete a profile with a given id
   * @param {string} id
   */
  deleteProfile(id: string) {
    swal({
      title: '<span style="color: #fff;">'+this.globals.strings.EDIT_PROFILE_SURE_DELETE+'</span>',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.globals.strings.GENERAL_YES,
      cancelButtonText: this.globals.strings.GENERAL_NO,
      background: '#2a292a'
    }
  ).then(result => {
    if (result.value) {
      this.profileDrawerService.deleteProfile(id);
    }
    });
  }

  /**
   * GET the available profile avatars images
   */
  loadAvatars() {
    let params = new HttpParams()
      .set('limit', this.maxAvatars)
      .set('page', '1')
      .set('device_type', 'web');
    this.http.get<APIDataResponse>(this.globals.endpoints.profileAvatars, {params: params})
      .toPromise()
      .then(
        res => {
          this.globals.profileAvatars = res.data;
          // Group the list of avatar images by 4 so they fit nicely on a 4x4 table
          for (let i=1; i < parseInt(this.maxAvatars); i = i + this.groupBy) {
            let group = this.globals.profileAvatars.slice(i, i + this.groupBy);
            this.avatarsListGrouped.push(group);
          }
        }
      )
      .catch(function (error) {
        console.error(error);
      });
  }

  /**
   * Sign out the current user
   */
  logout() {
    this.loginService.logout();
    // Since we might be in some logged in-content-only area ... just navigate to Home :P
    this.router.navigate(['']);
  }


  ngOnDestroy() {
    /*// unsubscribe to ensure no memory leaks
    this.profileDrawerService.visible.unsubscribe();
    this.profileDrawerService.loading.unsubscribe();*/
  }
}
