import {Param} from "./param";

export interface Action {
  description: string;
  name: string;
  params: Param [];
}
