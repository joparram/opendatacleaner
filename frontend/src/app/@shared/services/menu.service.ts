import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menusource = new Subject<any>();
  menu$ = this.menusource.asObservable();

  constructor() { }

  updateMenuEvents(e: any): void {
    this.menusource.next(e);
  }

}
