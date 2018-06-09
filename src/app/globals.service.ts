/*
Contains global variables used throughout the website
 */

import { Injectable } from '@angular/core';
import {Subscriptions} from "./models/subscriptions";
import {ProfileSubscriptions} from "./models/profile-subscriptions";
import { environment } from '../environments/environment';
import {AgeRatings} from "./models/age-ratings";

@Injectable()

export class GlobalsService {
  API: string = 'http://stripestaging.tvacms.com/api/';       // NO CACHE
  pageTitle: string;                                            // Contains the title of the current page
  pageTitleSlug: string;                                        // slug of the current page
  //accountSlug: string;                                          // slug of account settings
  menu: any;                                                    // Object containing the menu items of the website
  menuId: string;                                               // Contains the menu ID
  selectedMenu: string;                                         // The selected menu
  optionId: string;                                             // Contains the menu option ID
  languages: any;                                               // List of available languages
  strings: any;                                                 // Contains all the strings used throughout the app
  settings: any;                                                // Contains all the app's default settings
  favorites: any;                                               // Contains the list of favorites for the *current* profile
  subscriptions: Subscriptions;                                 // Contains all the available subscriptions
  profileSubscriptions: ProfileSubscriptions;                   // Contains an array of current profile's subscriptions
  ageRatings: AgeRatings;                                       // Contains the list of age ratings (language dependent)

  /* FACEBOOK LOGIN PARAMS */
  fbParams = environment.fbParams;

  /* LOGIN AND USER RELATED */
  userLoggedIn = false;                                 // Whether the user successfully logged in or not
  localStorageKeyPrefix = 'tvapptemp-2.0-';             // WARNING: changing this on version updates also logs out users!
  accountToken: string = null;                          // Holds the account token
  authToken: string = null;                             // Holds the authentication token, necessary to other API calls
  tempAuthToken: string = null;                         // Holds the temporary auth token (when all sessions have been spent)
  authTokenExpiration = 0;                              // Unix timestamp (0 == doesn't expire) -- seems to default to 1 week
  accountProfileToken: string = null;                   // Holds the current profile token
  userProfiles: APIProfile[] = [];                      // List of user profiles
  currProfile: any = null;
  defaultAvatar = 'assets/ic-default-avatar.png';       // The default avatar in user area after logout
  currAvatar = 'assets/ic-default-avatar.png';          // User current avatar
  profileAvatars: any[];                                // Hold the list of available avatars images
  hasActiveSubscription: boolean = false;               // Quick check flag for subscription status ...
  nbrOfLoginProviders: number = 1;                      // Determined upon getting settings from the API

  currUsername: string;
  currPassword: string;

  /* PAYMENTS RELATED */
  stripePubKey: string = environment.stripePubKey;      // It's set to the test or real keys depending on the environment
                                                        // ( see /environments/environment*.ts )


  endpoints: any = {
    settings: this.API + 'settings',
    languages: this.API + 'languages',
    strings: this.API + 'languages/strings',
    menus: this.API + 'menus',
    menuId: this.API + 'menus/' + this.menuId,
    menuDefault: this.API + 'menus/default',
    //menuOption: this.API + 'menus/' + this.menuId + '/option/' + this.optionId, // Old way
    menuOption: this.API + 'menus/{menu_id}/option/{option_id}',                  // GET menuoption details
    register: this.API + 'account/register',                                      // Register a new user
    login: this.API + 'account/login',                                            // Login user
    socialLogin: this.API + 'account/social_login',                               // Social Login user
    logout: this.API+'account/'+this.accountToken+'/logout',                      // Logout user
    liveSessions: this.API+'account/{account_token}/live_sessions',               // Get the live sessions for the current account
    profiles: this.API + 'account/{account_token}/profiles',                      // CRUD endpoint
    profile: this.API + 'account/',                                               // current account profile token follows ...
    profileAvatars: this.API + 'profile_avatars',                                 // Get profile avatars
    assets: this.API + 'assets',                                                  // Get an asset; Id follows
    assetsRelated: this.API + '{asset_id}/related',                               // Get an asset's related content; {asset_id} to be str_replaced
    assetsRate: this.API + 'account/{profile_token}/rate/{asset_id}',             // Rate an asset; {profile_token}, {asset_id} to be str_replaced
    assetsFavorite: this.API + 'account/{profile_token}/favourites/{asset_id}',   // (POST) Set an asset as a favorite for the current account's profile
                                                                                  // (GET) check if the asset is a favorite
                                                                                  // (DELETE) remove the asset from the favourites list
    assetsStream: this.API + 'assets/{asset_id}/streams/{stream_id}',             // Get an asset's stream for playing
    seasonsEpisodes: this.API + 'tvshow/{tvshow_id}/season/{season_id}/episodes',  // GET of a certain TVshow the episodes of a certain season

    /* Parental control related */
    setParentalControl: this.API + 'account/{profile_token}/parental_control',    // Set parental control on/off OR apply setting
                                                                                  // AND set parental pin


    ageRatings: this.API + 'age_ratings/{country_code}',
    verifyParentalPin: this.API + 'account/{profile_token}/parentalpin',          // (POST) Verify parental pin
    recoverParentalPin: this.API + 'account/{profile_token}/recover_parentalpin', // (PUT)  Recover parental pin
    changeParentalPin: this.API + 'account/{profile_token}/parentalpin',          // (PUT)  Update parental pin

    /* Subscriptions and payments related */
    subscriptions: this.API + 'subscriptions',                                    // Provide all the available subscriptions
    profileSubscriptions: this.API + 'account/{profile_token}/subscriptions',     // Get all of a given profile's subscriptions
    profilePaymentMethods: this.API + 'account/{profile_token}/{payment_gateway}/payment_methods',  // Get the current profile's payment methods, given a gateway
                                                                                                    // @Notes: currently available gateways: ['stripe', 'voucher']
    purchase: this.API + 'account/{profile_token}/purchase',                      // Purchase/subscribe a product in a store
    cancelSubscription: this.API + 'account/{profile_token}/subscriptions',       // Cancel a subscription for a give profile

    /* Entitlements */
    entitlements: this.API + 'account/{profile_token}/entitlements/{asset_id}',   // Get user entitlements for the asset for a given profile
    pairingCode: this.API + 'account/{profile_token}/pairing_code',               // PUT - add pairingcode on website to validate STV session

    /* Password related */
    changePassword: this.API + 'account/{profile_token}/password',                 // PUT - Change Profile Password

    /* User session related */
    sessionStatus: this.API + 'account/{profile_token}/status_session',            // GET - Get information about the session if it's still active


  };

  /* Enable or disable functionality here for specific customers */
  rules = {
    register: false,
    multipleProfiles: false,
    subscriptions: false,
    socialMediaFB: true,          // Enable disable social media links pending customer's indication (not avaiable in  the API)
    socialMediaTwitter: true,
    socialMediaInstagram: true,
    facebookLogin: false,
    purchasePin: false,
    manageCreditCard: false
  };

  // TVCable rules:
  tvcableGroup_asset_types=0;
  tvcableAsset_types='movies,series,channels';
  tvcableSearchQuery= '&device_type=web&device_layout=web&asset_types='+this.tvcableAsset_types+'&group_asset_types='+this.tvcableGroup_asset_types;
  //tvcableSearchQuery= 'device_type=web&device_layout=web&asset_types='+this.tvcableAsset_types;
}


// All API responses are enclosed in [data]
export interface APIDataResponse {
  data: any;
};

export interface APISuccessResponse {
  success: number,
  code: string,
  description: string,
  metadata: {}
}

export interface APIErrorResponse {
  code: string,
  description: string,
  error: string
};

export interface APILoginSuccess {
  'account_token': string,
  'auth_token': string,
  'auth_expires': number,
  'session_slots_available': number
}

export interface APIProviderLoginSuccess {
  account_token: string,
  auth_token: string,
  auth_expires: number,
  session_slots_available: string,
  login_providers_tokens: [
    {
      provider: string,
      auth_token: string
    }
    ]
}

export interface APIProfile {
      id: number,
      name: string,
      token: string,
      image: {
        url: string
      },
      avatar: {
        url: string
      },
      mobile_number: string,
      address: string,
      post_code: string
}

export interface APIProfileInfo {
  email: string,
  last_login: number,
  name: string,
  mobile_number: string,
  address: string,
  country: string,
  stripe_user_token: string,
  profile_picture: {
    url: string,
    name: string
  },
  user_language: string,
  eligible_for_trial: boolean,
  gender: string,
  birth_date: string,
  parental_controls: {
    enabled: boolean,
    setting: {
      id: number,
      name: string,
      description: string,
      level: number,
      country_code: string,
      image: {
        url: string
      }
    }
  },
  favourites: any [],
  bookmarks: [
    {
      asset_id: number,
      video_id: number,
      bookmark: number
    }
    ],
  purchases: [
    {
      asset_id: number
    }
    ],
  rentals: [
    {
      asset_id: number,
      start_date: number,
      end_date: number
    }
    ],
  subscriptions: [
    {
      id: string,
      plan_id: string,
      plan_name: string,
      plan_interval: string,
      start_date: number,
      end_date: number,
      payment_gateway: string
    }
    ]
};
