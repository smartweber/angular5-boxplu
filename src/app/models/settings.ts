export interface Settings {
  default_language: string,
  /* livetv_type: string, */ /* Doesn't exist yet */
  image_base_url: string,
  force_update: string,
  menu_size: string,
  menu_orientation: string,
  menu_behaviour: string,
  menu_animation: string,
  client_name: string,
  logo_image: {
    url: string,
    width: string,
    height: string
  },
  splash_screen_type: string,
  splash_screen_media: {
    url: string,
    width: string,
    height: string,
    format: string
  },
  background_type: string,
  background_image: {
    url: string,
    width: string,
    height: string
  },
  background_color: string,
  user_configurations: {
    authentication_screens: {
      login: string,
      register: string,
      pairing: string,
      skip: string,
      language_selection: string
    },
    parental_control_enabled: string,
    parental_control_grant_type: string,
    multiple_profile: string,
    mandatory_genre_selection: string,
    login_screen_type: string,
    side_menu_account_info: string
  },
  terms_conditions_slug: string,
  help_slug: string,
  faq_slug: string,
  default_age_rating_country_code: string,
  reminders_config: {
    place: string,
    alarms: [
      string
      ]
  },
  profiles_limit: string,
  enabled_favorites: {
    channel: string,
    series: string,
    season: string,
    episode: string,
    movie: string
  }
}
