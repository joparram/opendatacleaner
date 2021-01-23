import {
  AfterViewInit,
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ViewChildren,
  SimpleChanges,
  OnChanges,
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
export class ImportDialogComponent implements AfterViewInit, OnChanges {
  public plugin: any = 'none';
  public action: any = undefined;
  public component: ActionComponent;
  public parameters: FormGroup;
  hola: string = 'hola';
  @ViewChildren('actions') actions: any;
  constructor(
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    private importService: ImportService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.parameters = new FormGroup({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('onchanges');
  }
  resetActionValue() {
    this.action = undefined;
    this.ref.detectChanges();
    this.action = this.actions.first.value;
    this.ref.detectChanges();
  }
  clickRadioButton(event: Event) {
    event.preventDefault();
  }
  detectPluginChanges() {
    this.resetActionValue();
  }
  detectActionChanges() {
    this.ref.detectChanges();
    console.log(this.action);
  }
  getActions() {
    if (this.component !== undefined) {
      if (this.plugin === 'none') {
        return this.component.actions;
      } else {
        return this.component.plugins.find((element) => element.id === this.plugin.id).actions;
      }
    }
  }
  ngAfterViewInit(): void {
    this.resetActionValue();
  }
}
