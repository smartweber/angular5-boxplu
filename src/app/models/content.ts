import {Seo} from './seo';
import {Cast} from './cast';
import {Images} from './images';

export class Content {
  added_date: string;
  age_rating: string;
  asset_type: string;
  banner: string;
  actors: Cast[];
  directors: Cast[];
  music_composers: Cast[];
  singers: Cast[];
  song_writers: Cast[];
  writers: Cast[];
  description: string;
  id: number;
  image: any;
  images: Images;
  test: string;
  length: number;
  name: string;
  production_year: number;
  order: number;
  progress: number;
  poster: string;
  rating: number;
  seo: Seo;
  slug: string;
  synopsis: string;
  subtitle: string;
  video_id: number;
}
