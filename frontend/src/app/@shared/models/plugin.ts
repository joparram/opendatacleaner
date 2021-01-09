import { Action } from './action';

export interface Plugin {
  description: string;
  handler_class: string;
  interfacename: string;
  name: string;
  actions: Action [];
}
