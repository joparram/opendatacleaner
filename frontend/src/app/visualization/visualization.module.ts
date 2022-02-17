import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ExDatatableModule } from '@app/ex-datatable/ex-datatable.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@app/material.module';
import { VisualizationRoutingModule } from './visualization-routing.module';
import { VisualizationComponent } from './visualization.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FlexLayoutModule, MaterialModule, VisualizationRoutingModule, ExDatatableModule,FormsModule,
    ReactiveFormsModule,],
  declarations: [VisualizationComponent],
})
export class VisualizationModule {}
