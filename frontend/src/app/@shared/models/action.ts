import {Param} from "./param";

export interface Action {
  id: string;
  description: string;
  name: string;
  params: Param [];
}
