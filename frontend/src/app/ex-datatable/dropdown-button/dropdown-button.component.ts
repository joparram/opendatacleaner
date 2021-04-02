import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownButtonComponent implements OnInit {
  visible: boolean = false;
  @ViewChild('menuBtn') menuBtn: ElementRef;

  constructor() {}

  ngOnInit(): void {}
}
