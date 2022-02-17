import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EXDatasourceParams } from '@app/ex-datatable/models/table-data';
import { environment } from '@env/environment';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss'],
})
export class VisualizationComponent implements OnInit {
  version: string | null = environment.version;
  dataSubscription: any;
  constructor(private ref: ChangeDetectorRef,  private dialog: MatDialog) {}
  dialogRef: any;
  processorPlugins: any[] = [] as any;
  importerPlugins: any[] = [] as any;
  databaseExporterPlugins: any[] = [] as any;
  dataPlugins: any[] = [] as any;
  exporterPlugins: any[] = [] as any;

  ngOnInit() {

  }


  click(event: any) {
    console.log("clicked");
  }


}
