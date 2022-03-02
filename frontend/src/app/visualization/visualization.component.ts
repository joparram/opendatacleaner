import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EXDatasourceParams } from '@app/ex-datatable/models/table-data';
import { environment } from '@env/environment';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { VisualizationService } from '@app/@shared/services/visualization.service';
import { ActionDialogComponent } from '@app/@shared/components/component-dialog/action-dialog.component';
import { ActionComponent } from '@app/@shared/models/action-component';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss'],
})
export class VisualizationComponent implements OnInit {
  version: string | null = environment.version;
  dataSubscription: any;
  constructor(private ref: ChangeDetectorRef,  private dialog: MatDialog, private visualizationService: VisualizationService) {}
  dialogRef: any;
  processorPlugins: any[] = [] as any;
  importerPlugins: any[] = [] as any;
  databaseExporterPlugins: any[] = [] as any;
  dataPlugins: any[] = [] as any;
  exporterPlugins: any[] = [] as any;

  plot: any;


  ngOnInit(): void {

  }

  visualization() {
    this.visualizationService.get().pipe(take(1)).subscribe((component: ActionComponent) => {
      this.visualizationDialog(component);
    })
  }

  visualizationDialog(component: ActionComponent) {
    this.dialogRef = this.dialog.open(ActionDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.component = component;
    this.dialogRef.afterClosed().pipe(take(1)).subscribe((dataForm: any) => {
      if (dataForm) {
        this.visualizationService
          .post(dataForm)
          .subscribe((data: any) => {
            var reader = new FileReader();

            reader.onload = (event: any) => {
              this.plot = event.target.result;
            };

            reader.onerror = (event: any) => {
              console.log("File could not be read: " + event.target.error.code);
            };

            reader.readAsDataURL(data.file);
            console.log(data)
          });
      }
    });
  }

}
