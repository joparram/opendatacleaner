import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
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
  contextmenuItems: any[] = [
    {
      title: 'borrar fila',
      function: () => this.deleteRow(),
    },
  ]
  menuItems: any[] = [
    {
      title: 'Cambiar Tipo',
      menu: [
        {
          title: 'object',
          function: () => this.setType('object'),
        },
        {
          title: 'float',
          function: () => this.setType('float'),
        },
        {
          title: 'int64',
          function: () => this.setType('int64'),
        },
        {
          title: 'float64',
          function: () => this.setType('float64'),
        },
        {
          title: 'bool',
          function: () => this.setType('bool'),
        },
        {
          title: 'datetime64[ns]',
          function: () => this.setType('datetime64[ns]'),
        },
      ],
    },
    {
      title: 'Procesar',
      function: (column: any) => this.processor(column),
    },
    {
      title: 'Borrar',
      function: (column: any) => this.deleteColumn(column)
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
          this.minRow = params.firstRow;
          this.maxRow = params.lastRow;
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
  private processor(column: any) {
    this.processorService.get().subscribe((component: ActionComponent) => {
      this.processorDialog(component, undefined, column);
    })
  }


  private setType(type: string) {
    let dataForm = {
      column:this.selectedColumn,
      row: this.selectedRow,
      type: type,
      action: 'setType'
    };
    this.dataService
          .post(dataForm, { startRow: this.minRow, endRow: this.maxRow })
          .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
  }

  private deleteRow() {
    console.log("row: ", this.selectedRow)
    console.log("holaaaaa")
    this.dataService
    .post({action: 'deleteRow', "column": undefined, "row": this.selectedRow}, { startRow: this.minRow, endRow: this.maxRow })
    .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
  }

  private deleteColumn(column: any) {
    console.log("Columna: ", column)
    this.dataService
    .post({action: 'deleteColumn', "column": column,"row": undefined}, { startRow: this.minRow, endRow: this.maxRow })
    .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
  }

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
  private processorDialog(component: ActionComponent, selectedRow?: any, selectedColumn?: any) {
    this.dialogRef = this.dialog.open(ActionDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.component = component;
    this.dialogRef.afterClosed().subscribe((dataForm: any) => {
      if (dataForm) {
        dataForm.column = (selectedColumn !== undefined) ? selectedColumn : this.selectedColumn;
        dataForm.row = (selectedRow !== undefined) ? selectedRow : this.selectedRow;
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
        console.log(dataForm)
        dataForm.column = this.selectedColumn;
        dataForm.row = this.selectedRow;
        console.log(dataForm)
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
