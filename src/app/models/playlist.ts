import {Pagination} from "./pagination";
import {Content} from "./content";
import {Genre} from "./genre";

export class Playlist {
  contents: Content[];
  description: string;
  id: number;
  image: string;
  name: string;
  order: number;
  genres: Genre[];
  seo_description: string;
  seo_keywords: string;
  seo_title: string;
  short_name: string;
  slug: string;
  subtitle: string;
  type: string;
  pagination: Pagination;
}
