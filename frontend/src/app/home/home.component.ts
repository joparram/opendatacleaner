import { Component, HostListener, Input, ViewChild, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { GridOptions, IDatasource, IGetRowsParams, ColDef } from 'ag-grid';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable, Subscription } from 'rxjs';
import { of } from 'rxjs';
import { QuoteService } from './quote.service';
import { ImportService } from '@app/@shared/services/import.service';
import { DatabaseExporterService } from '@app/@shared/services/databaseexporter.service';
import { ExporterService } from '@app/@shared/services/exporter.service';

import { ProcessorService } from '@app/@shared/services/processor.service';
import { MenuService } from '@app/@shared/services/menu.service';
import { PaginatedDataService } from '@app/@shared/services/paginateddata.service';
import { DataService } from '@app/@shared/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionComponent } from '@app/@shared/models/action-component';
import { ActionDialogComponent } from '@shared/components/component-dialog/action-dialog.component';
import {  EXDatasourceParams, EXTableDatasource } from '@app/ex-datatable/models/table-data';
import { Cell, EXTableEvents} from '@app/ex-datatable/models/table-events';
import { AppLoaderService } from '@app/@shared/services/apploader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  types: any;
  selectedColumn: any;
  selectedRow: any;
  dialogRef: any;
  minRow: number = 0;
  maxRow: number = 50;
  dataSubscription: Subscription = new Subscription();
  datasource: EXTableDatasource;
  gridEvents: EXTableEvents;
  menuItems: any[] = [
    {
      title: 'Cambiar Tipo',
      menu: [
        {
          title: 'int',
          function: () => console.log('hello world!'),
        },
        {
          title: 'float',
        },
        {
          title: 'string',
        },
      ],
    },
    {
      title: 'Borrar Columna',
    },
  ];

  constructor(
    private importService: ImportService,
    private processorService: ProcessorService,
    private menuService: MenuService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private paginateddataservice: PaginatedDataService,
    private dataService: DataService,
    private databaseexporterService: DatabaseExporterService,
    private exporterService: ExporterService
  ) {
    this.menuService.menu$.subscribe((event) => {
      switch (event.action) {
        case 'import':
          this.importService.get().subscribe((component: ActionComponent) => {
            this.importDialog(component);
          });
          break;
        case 'process':
          this.processorService.get().subscribe((component: ActionComponent) => {
            this.processorDialog(component);
          });
          break;
        case 'data':
          this.dataService.get().subscribe((component: ActionComponent) => {
            this.dataDialog(component);
          });
          break;
        case 'export':
          this.exporterService.get().subscribe((component: ActionComponent) => {
            this.exporterDialog(component);
          });
          break;
        case 'databaseexporter':
          this.databaseexporterService.get().subscribe((component: ActionComponent) => {
            this.databaseExporterDialog(component);
          });
          break;
        default:
          break;
      }
    });



    this.paginateddataservice.types$.subscribe((types: any) => {
      this.types = types;
    });

    this.gridEvents = {
      onEditCell: (cell: Cell) => {
        console.log("onEditCell")
        this.updateCellValue(cell)
      },
      onFocusCell: (cell: Cell) => {
        this.selectedColumn = cell.columnName;
        this.selectedRow = cell.x;
      },
    }
  }

  ngOnInit() {

  }

  onInitTable(params: EXDatasourceParams) {
    let datasource = {
      getData: (params: EXDatasourceParams) => {
          this.dataSubscription.unsubscribe();
          this.dataSubscription = this.paginateddataservice.fulldata$.subscribe((data: any) => {
            params.readyData(data.data, data.columns);
            this.ref.detectChanges();
          });
          this.paginateddataservice.get({ startRow: params.firstRow, endRow: params.lastRow }).subscribe((data: any) => {
            this.paginateddataservice.updateDataEvents(data);
          });
        },
      };
      params.setDatasource(datasource);
  }

  click(event: any) {
    this.menuService.updateMenuEvents(event);
  }


  updateCellValue(cell: Cell) {
    let dataForm = {
      column: cell.columnName,
      row: cell.x,
      action: 'updateCell',
      value: cell.value,
    };
    console.log(dataForm)
    this.dataService
      .post(dataForm, { startRow: this.minRow, endRow: this.maxRow })
      .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
  }

  /*DIALOGS*/
  private importDialog(component: ActionComponent) {
    this.dialogRef = this.dialog.open(ActionDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.component = component;
    this.dialogRef.afterClosed().subscribe((confirm: any) => {
      if (confirm) {
        this.importService
          .post(confirm, { startRow: this.minRow, endRow: this.maxRow })
          .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
      }
    });
  }
  private processorDialog(component: ActionComponent) {
    this.dialogRef = this.dialog.open(ActionDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.component = component;
    this.dialogRef.afterClosed().subscribe((dataForm: any) => {
      if (dataForm) {
        dataForm.column = this.selectedColumn;
        dataForm.row = this.selectedRow;
        this.processorService
          .post(dataForm, { startRow: this.minRow, endRow: this.maxRow })
          .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
      }
    });
  }
  private dataDialog(component: ActionComponent) {
    this.dialogRef = this.dialog.open(ActionDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.component = component;
    this.dialogRef.afterClosed().subscribe((dataForm: any) => {
      if (dataForm) {
        dataForm.column = this.selectedColumn;
        dataForm.row = this.selectedRow;
        this.dataService
          .post(dataForm, { startRow: this.minRow, endRow: this.maxRow })
          .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
      }
    });
  }
  private databaseExporterDialog(component: ActionComponent) {
    this.dialogRef = this.dialog.open(ActionDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.component = component;
    this.dialogRef.afterClosed().subscribe((dataForm: any) => {
      if (dataForm) {
        dataForm.column = this.selectedColumn;
        dataForm.row = this.selectedRow;
        this.databaseexporterService
          .post(dataForm, { startRow: this.minRow, endRow: this.maxRow })
          .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
      }
    });
  }
  private exporterDialog(component: ActionComponent) {
    this.dialogRef = this.dialog.open(ActionDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.component = component;
    this.dialogRef.afterClosed().subscribe((dataForm: any) => {
      if (dataForm) {
        dataForm.column = this.selectedColumn;
        dataForm.row = this.selectedRow;
        this.exporterService.post(dataForm, { startRow: this.minRow, endRow: this.maxRow }).subscribe((data: any) => {
          const element = document.createElement('a');
          element.href = URL.createObjectURL(data.file);
          element.download = data.filename;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        });
      }
    });
  }
  /*FIN DIALOGS*/
}
