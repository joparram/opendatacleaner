import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.scss']
})
export class DropdownButtonComponent implements OnInit {
  visible: boolean = false;
  @ViewChild('menuBtn') menuBtn: ElementRef;
  @Input() menuItems: any = [];
  @Input() columnid: any;

  constructor() {}

  ngOnInit(): void {
  }

  onClickMenuItem(fun: Function) {
    this.menuBtn.nativeElement.blur();
    console.log(this.columnid)
    if (fun !== undefined) {
      fun(this.columnid);
    }
  }
}
