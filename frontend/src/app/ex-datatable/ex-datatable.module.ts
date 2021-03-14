import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExDatatableComponent } from './ex-datatable/ex-datatable.component';

@NgModule({
  declarations: [ExDatatableComponent],
  imports: [CommonModule],
  exports: [ExDatatableComponent],
})
export class ExDatatableModule {}
