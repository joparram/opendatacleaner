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
    var menu = document.getElementById("contextMenu")
    menu.style.display = 'block';
    menu.style.left = e.pageX  + "px";
    menu.style.top = e.layerY + "px";
  }


  hideMenu() {
      document.getElementById("contextMenu").style.display = "none"
  }

  onClickMenuItem(fun: Function) {
    console.log("onClickMenuItem");
    if (fun !== undefined) {
      fun();
    }
    this.hideMenu();
  }

}
