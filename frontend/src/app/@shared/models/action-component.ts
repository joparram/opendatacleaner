import {Action} from "./action";
import {ActionPlugin} from "./action-plugin";

export interface ActionComponent {
  id: string;
  description: string;
  handler_class: string;
  interfacename: string;
  name: string;
  actions: Action [];
  plugins: ActionPlugin [];
}
