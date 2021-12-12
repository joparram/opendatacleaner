import {
  AfterViewInit,
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ViewChildren,
  SimpleChanges,
  OnChanges,
  QueryList,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Param } from '@app/@shared/models/param';
import { ImportService } from '@app/@shared/services/import.service';
import { ActionComponent } from '@shared/models/action-component';
@Component({
  selector: 'import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss'],
})
export class ImportDialogComponent implements OnChanges {
  public plugin: any = 'none';
  public action: any = undefined;
  public component: ActionComponent;
  public parameters: FormGroup;
  @ViewChildren('fileinput') fileInputs: QueryList<ElementRef>;
  @ViewChildren('actions') actions: any;
  constructor(public dialogRef: MatDialogRef<ImportDialogComponent>, private ref: ChangeDetectorRef) {
    this.parameters = new FormGroup({});
  }

  getFormData() {
    let params = this.parameters.getRawValue();
    this.fileInputs.forEach((elem: ElementRef) => {
      let files = elem.nativeElement.files;
      let name = elem.nativeElement.name;
      if (files.length > 0) {
        params[name] = files[0];
      } else {
        try {
          delete params[name];
        } catch (err) {}
      }
    });
    console.log(params);
    return params;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('onchanges');
  }
  clickRadioButton(event: Event) {
    event.preventDefault();
  }
  detectActionChanges() {
    this.ref.detectChanges();
    console.log(this.action);
  }

}
