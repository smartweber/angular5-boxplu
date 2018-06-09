import {Record} from "immutable";

const ProfileItem = Record({
    id: null,
    name: '',
    token: '',
    image: {
      url: ''
    },
    avatar: {
      url: ''
    },
    mobile_number: '',
    address: '',
    post_code: ''
});

export class Profile extends ProfileItem {
  id: string;
  name: string;
  token: string;
  image: {
    url: string
  };
  avatar: {
    url: string
  };
  mobile_number: string;
  address: string;
  post_code: string;

  constructor(props: any) {
    super(props);
  };
}

