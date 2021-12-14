import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import {ContextMenu} from '@app/ex-datatable/models/context-menu'

@Component({
  selector: 'excontext-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  @ViewChild("contextmenu") contextmenu: ElementRef;
  @Input() items: ContextMenu[] = []

  constructor() { }

  ngOnInit() {

  }

  @HostListener('document:click')
  public onClick(event: any) {
    const clickedInside = this.contextmenu.nativeElement.contains(event);
    if (!clickedInside) {
      this.hideMenu();
    }
  }


  rightClick(e: any) {
    e.preventDefault();
    this.contextmenu.nativeElement.style.display = 'block';
    this.contextmenu.nativeElement.style.left = e.clientX + 'px';
    this.contextmenu.nativeElement.style.top = e.layerY + 'px';
    console.log(e)
  }


  hideMenu() {
    this.contextmenu.nativeElement.style.display = 'none';
  }

  onClickMenuItem(fun: Function) {
    if (fun !== undefined) {
      fun();
    }
    this.hideMenu();
  }

}
