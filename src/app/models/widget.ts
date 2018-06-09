import {Layout} from "./layout";
import {Playlist} from "./playlist";

export class Widget {
  id: number;
  layout: Layout;
  playlist: Playlist;
  position: number;
  slug: string;
  type: string;
}
