import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActionComponent } from '../../models/action-component';

@Component({
  selector: 'action-dialog',
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss'],
})
export class ActionDialogComponent implements OnInit {
  public plugin: any = 'none';
  public action: any = undefined;
  public component: ActionComponent;
  public parameters: FormGroup;
  @ViewChildren('actions') actions: any;
  @ViewChildren('fileinput') fileInputs: QueryList<ElementRef>;
  constructor(
    public dialogRef: MatDialogRef<ActionDialogComponent>,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.parameters = this.fb.group({});
  }

  ngOnInit(): void {
    this.parameters = this.fb.group({});
    this.plugin = 'none';
    this.action = this.component.actions[0];
    this.createParametersForm();
  }
  onPluginChange() {
    this.parameters = this.fb.group({});
    this.action = this.getActions()[0];
  }
  getFormData() {
    let params = this.parameters.getRawValue();
    params.action = this.action.name;
    params.plugin = this.plugin.name;
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

  public onChanges() {
    this.createParametersForm();
  }

  public getActions() {
    if (this.component !== undefined) {
      if (this.plugin === 'none') {
        return this.component.actions;
      } else {
        return this.component.plugins.find((element) => element.id === this.plugin.id).actions;
      }
    }
  }

  private createParametersForm() {
    if (this.action !== undefined) {
      this.parameters = this.fb.group({});
      const params = this.action.params;
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        this.parameters.addControl(param.name, this.fb.control(''));
      }
    }
    this.ref.detectChanges();
  }
}
