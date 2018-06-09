import {Record} from "immutable";

const ProfileDetailsItem = Record(
  {
      email: '',
      last_login: 0,
      name: '',
      mobile_number: '',
      address: '',
      country: '',
      stripe_user_token: '',
      profile_picture: {
        url: '',
        name: ''
      },
      user_language: '',
      eligible_for_trial: 0,
      gender: '',
      birth_date: '',
      parental_controls: {
        enabled: 0,
        setting: {
          id: 0,
          name: '',
          description: '',
          level: 0,
          country_code: '',
          image: {
            url: ''
          }
        }
      },
      favourites: [],
      bookmarks: [
        {
          asset_id: 0,
          video_id: 0,
          bookmark: 0
        }
      ],
      purchases: [
        {
          asset_id: 0
        }
      ],
      rentals: [
        {
          "asset_id": 0,
          "start_date": 0,
          "end_date": 0
        }
      ],
      subscriptions: [
        {
          id: '',
          plan_id: '',
          plan_name: '',
          plan_interval: '',
          start_date: 0,
          end_date: 0,
          payment_gateway: ''
        }
      ]
    }
);

export class ProfileDetails extends ProfileDetailsItem {
  email: string;
  last_login: number;
  name: string;
  mobile_number: string;
  address: string;
  country: string;
  stripe_user_token: string;
  profile_picture: {
    url: string,
    name: string
  };
  user_language: string;
  eligible_for_trial: boolean;
  gender: string;
  birth_date: string;
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
  };
  favourites: any [];
  bookmarks: [
    {
      asset_id: number,
      video_id: number,
      bookmark: number
    }
    ];
  purchases: [
    {
      asset_id: number
    }
    ];
  rentals: [
    {
      "asset_id": number,
      "start_date": number,
      "end_date": number
    }
    ];
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

  constructor(props: any) {
    super(props);
  };
};
