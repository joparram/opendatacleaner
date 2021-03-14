import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { AgGridModule } from 'ag-grid-angular';
import { ImportService } from '@shared/services/import.service';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    HomeRoutingModule,
    AgGridModule.withComponents([]),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [HomeComponent, ImportDialogComponent],
  providers: [ImportService],
})
export class HomeModule {}
