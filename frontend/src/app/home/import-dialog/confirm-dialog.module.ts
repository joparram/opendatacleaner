import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule } from '@angular/material';

import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
    declarations: [
      ConfirmDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule
    ],
    entryComponents: [
        ConfirmDialogComponent
    ],
})
export class ConfirmDialogModule
{
}
