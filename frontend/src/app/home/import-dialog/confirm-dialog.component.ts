import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector   : 'fuse-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls  : ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent
{
    public confirmHeader: string;
    public confirmMessage: string;
    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>)
    {
    }

}
