import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExDatatableComponent } from './ex-datatable/ex-datatable.component';
import { DropdownButtonComponent } from './dropdown-button/dropdown-button.component';

@NgModule({
  declarations: [ExDatatableComponent, DropdownButtonComponent],
  imports: [CommonModule],
  exports: [ExDatatableComponent],
})
export class ExDatatableModule {}
