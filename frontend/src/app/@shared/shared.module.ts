import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { ActionDialogComponent } from './components/component-dialog/action-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [LoaderComponent, ActionDialogComponent],
  exports: [LoaderComponent, ActionDialogComponent],
})
export class SharedModule {}
