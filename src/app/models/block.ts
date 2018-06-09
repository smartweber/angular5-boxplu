import {Widget} from "./widget";

export class Block {
  block_type: string;
  id: number;
  position: number;
  slug: string;
  style: string;
  type: string;
  selected: boolean;
  widgets: Widget[];
}
