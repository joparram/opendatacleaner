import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExDatatableComponent } from './ex-datatable/ex-datatable.component';
import { DropdownButtonComponent } from './dropdown-button/dropdown-button.component';
import { ExPaginatorComponent } from './ex-paginator/ex-paginator.component';
import { ExDatatableDirective } from './directives/exdatatable.directive';
import { ExContextMenuDirective } from './directives/context-menu.directive';
import { ContextMenuComponent } from './context-menu/context-menu.component';

@NgModule({
  declarations: [ExDatatableComponent, DropdownButtonComponent, ExPaginatorComponent, ExDatatableDirective, ContextMenuComponent, ExContextMenuDirective],
  imports: [CommonModule],
  exports: [ExDatatableComponent],
})
export class ExDatatableModule {}
