import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EXDatasourceParams } from '@app/ex-datatable/models/table-data';
import { PluginmanagerService } from '@app/@shared/services/pluginmanager.service';
import {ImportDialogComponent} from './import-dialog/import-dialog.component';
import { environment } from '@env/environment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pluginmanager',
  templateUrl: './pluginmanager.component.html',
  styleUrls: ['./pluginmanager.component.scss'],
})
export class PluginmanagerComponent implements OnInit {
  version: string | null = environment.version;
  dataSubscription: any;
  constructor(private ref: ChangeDetectorRef, private pluginmanager: PluginmanagerService, private dialog: MatDialog) {}
  dialogRef: any;
  processorPlugins: any[] = [] as any;
  importerPlugins: any[] = [] as any;
  databaseExporterPlugins: any[] = [] as any;
  dataPlugins: any[] = [] as any;
  exporterPlugins: any[] = [] as any;

  ngOnInit() {
    this.pluginmanager.getPlugins().subscribe((data: any) => {
      this.processorPlugins = data.processorPlugins;
      this.importerPlugins = data.importerPlugins;
      this.databaseExporterPlugins = data.databaseExporterPlugins;
      this.dataPlugins = data.dataPlugins;
      this.exporterPlugins = data.exporterPlugins;
      this.ref.detectChanges();
    });
  }

  downloadTemplate(component: string) {
    this.pluginmanager.getTemplate(component).subscribe((data: any) => {
      const element = document.createElement('a');
      element.href = URL.createObjectURL(data.file);
      element.download = data.filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    })
  }

  deletePlugin(component: any, pluginName: any) {
    this.pluginmanager.deletePlugin(component, pluginName).subscribe((data) => {
      this.processorPlugins = data.processorPlugins;
      this.importerPlugins = data.importerPlugins;
      this.databaseExporterPlugins = data.databaseExporterPlugins;
      this.dataPlugins = data.dataPlugins;
      this.exporterPlugins = data.exporterPlugins;
      this.ref.detectChanges();
    });
  }
  uploadPluginDialog() {
    this.dialogRef = this.dialog.open(ImportDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.afterClosed().subscribe((confirm: any) => {
      if (confirm) {
        this.pluginmanager.uploadPlugin(confirm.file).subscribe((data: any) => {
          this.processorPlugins = data.processorPlugins;
          this.importerPlugins = data.importerPlugins;
          this.databaseExporterPlugins = data.databaseExporterPlugins;
          this.dataPlugins = data.dataPlugins;
          this.exporterPlugins = data.exporterPlugins;
          this.ref.detectChanges();
        });
      }
    });
  }

  click(event: any) {
    console.log("clicked");
  }


}
