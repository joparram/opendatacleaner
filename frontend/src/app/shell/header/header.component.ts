import { Title } from '@angular/platform-browser';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MenuService } from '@shared/services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() sidenav!: MatSidenav;

  constructor(private titleService: Title, private menuService: MenuService) {}

  click(event: any) {
    this.menuService.updateMenuEvents(event);
    console.log(event);
  }

  ngOnInit() {}

  get title(): string {
    return this.titleService.getTitle();
  }
}
