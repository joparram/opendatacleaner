import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { ExLoggerComponent } from './ex-logger.component';

@NgModule({
  declarations: [ExLoggerComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ExLoggerComponent],
})
export class ExLoggerModule {}
