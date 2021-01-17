import { Action } from './action';

export interface ActionPlugin {
  id: string;
  description: string;
  handler_class: string;
  interfacename: string;
  name: string;
  actions: Action [];
}
