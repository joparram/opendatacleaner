import {Action} from "./action";
import {Plugin} from "./plugin";

export interface Component {
  description: string;
  handler_class: string;
  interfacename: string;
  name: string;
  actions: Action [];
  plugins: Plugin [];
}
