import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';
import { ExDatatableModule } from '@app/ex-datatable/ex-datatable.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@app/material.module';
import { PluginmanagerRoutingModule } from './pluginmanager-routing.module';
import { PluginmanagerComponent } from './pluginmanager.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FlexLayoutModule, MaterialModule, PluginmanagerRoutingModule, ExDatatableModule,FormsModule,
    ReactiveFormsModule,],
  declarations: [PluginmanagerComponent, ImportDialogComponent],
})
export class PluginmanagerModule {}
