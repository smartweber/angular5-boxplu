import {Video} from "./video";
import {Scheduling} from "./scheduling";


export class EpgChannel {
  age_rating: any;
  channel_number: number;
  id: number;
  image: object;
  name: string;
  rating: number;
  scheduling: Scheduling[];
  nowPlaying: Scheduling;
  short_description: string;
  slug: string;
  type: string;
  video: Video;
}
