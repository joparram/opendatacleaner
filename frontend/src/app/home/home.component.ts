import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImportService } from '@app/@shared/services/import.service';
import { DatabaseExporterService } from '@app/@shared/services/databaseexporter.service';
import { ExporterService } from '@app/@shared/services/exporter.service';

import { ProcessorService } from '@app/@shared/services/processor.service';

import { TransformService } from '@app/@shared/services/transform.service';

import { MenuService } from '@app/@shared/services/menu.service';
import { PaginatedDataService } from '@app/@shared/services/paginateddata.service';
import { DataService } from '@app/@shared/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionComponent } from '@app/@shared/models/action-component';
import { ActionDialogComponent } from '@shared/components/component-dialog/action-dialog.component';
import {  EXDatasourceParams, EXTableDatasource } from '@app/ex-datatable/models/table-data';
import { Cell, EXTableEvents} from '@app/ex-datatable/models/table-events';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  types: any;
  selectedColumn: any;
  selectedRow: any;
  dialogRef: any;
  subscriptions: Subscription[] = [] as Subscription[];
  minRow: number = 0;
  maxRow: number = 50;
  dataSubscription: Subscription = new Subscription();
  datasource: EXTableDatasource;
  logs = ["logs"];
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
          title: 'str',
          function: (c: any) => this.setType(c, 'str'),
        },
        {
          title: 'object',
          function: (c: any) => this.setType(c, 'object'),
        },
        {
          title: 'float',
          function: (c: any) => this.setType(c, 'float'),
        },
        {
          title: 'int64',
          function: (c: any) => this.setType(c, 'int64'),
        },
        {
          title: 'float64',
          function: (c: any) => this.setType(c, 'float64'),
        },
        {
          title: 'bool',
          function: (c: any) => this.setType(c, 'bool'),
        },
        {
          title: 'datetime64[ns]',
          function: (c: any) => this.setType(c, 'datetime64[ns]'),
        },
      ],
    },
    {
      title: 'Procesar',
      function: (c: any) => this.processor(c),
    },
    {
      title: 'Transformar',
      function: (c: any) => this.transform(c),
    },
    {
      title: 'Borrar',
      function: (c: any) => this.deleteColumn(c)
    },
  ];

  constructor(
    private importService: ImportService,
    private processorService: ProcessorService,
    private transformService: TransformService,
    private menuService: MenuService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private paginateddataservice: PaginatedDataService,
    private dataService: DataService,
    private databaseexporterService: DatabaseExporterService,
    private exporterService: ExporterService
  ) {
    this.subscriptions.push(
      this.menuService.menu$.subscribe((event) => {
        switch (event.action) {
          case 'import':
              this.importService.get().pipe(take(1)).subscribe((component: ActionComponent) => {
                console.log("import")
                this.importDialog(component);
              })
            break;
          case 'close':
            this.closeProject()
          break;
          case 'process':
              this.processorService.get().pipe(take(1)).subscribe((component: ActionComponent) => {
                console.log("process")
                this.processorDialog(component);
              })
            break;
          case 'transform':
            this.transformService.get().pipe(take(1)).subscribe((component: ActionComponent) => {
              console.log("transform")
              this.transformDialog(component);
            })
          break;
          case 'data':
              this.dataService.get().pipe(take(1)).subscribe((component: ActionComponent) => {
                this.dataDialog(component);
              })
            break;
          case 'export':
              this.exporterService.get().pipe(take(1)).subscribe((component: ActionComponent) => {
                this.exporterDialog(component);
              })
            break;
          case 'databaseexporter':
              this.databaseexporterService.get().pipe(take(1)).subscribe((component: ActionComponent) => {
                this.databaseExporterDialog(component);
              })
            break;
          default:
            break;
        }
      })
    );


    this.subscriptions.push(
      this.paginateddataservice.types$.subscribe((types: any) => {
        this.types = types;
      })
    );

    this.gridEvents = {
      onEditCell: (cell: Cell) => {
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
          this.subscriptions.push(
            this.dataSubscription = this.paginateddataservice.fulldata$.subscribe((data: any) => {
              console.log("******************")
              console.log(data)
              const headers = data.columns
              headers.forEach((header: any) => {
                header.subtitle = "type:" + data.types[header.field]
              })
              console.log(headers)
              params.readyData(data.data, data.columns);
              this.ref.detectChanges();
            })
          );
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
    this.dataService
      .post(dataForm, { startRow: this.minRow, endRow: this.maxRow })
      .pipe(take(1))
      .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data))
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    console.log(this.subscriptions)
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    console.log("destroy")
  }
  /*DIALOGS*/
  private processor(c: any) {
    this.processorService.get().pipe(take(1)).subscribe((component: ActionComponent) => {
      this.processorDialog(component, undefined, c);
    })
  }
  private transform(column: any) {
    this.transformService.get().pipe(take(1)).subscribe((component: ActionComponent) => {
      this.transformDialog(component, undefined, column);
    })
  }


  private setType(c: any, type: string) {
    let dataForm = {
      column: c,
      row: this.selectedRow,
      type: type,
      action: 'setType'
    };
    this.dataService
          .post(dataForm, { startRow: this.minRow, endRow: this.maxRow })
          .pipe(take(1))
          .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
  }

  private deleteRow() {
    this.dataService
    .post({action: 'deleteRow', "column": undefined, "row": this.selectedRow}, { startRow: this.minRow, endRow: this.maxRow })
    .pipe(take(1))
    .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
  }

  private closeProject() {
    this.dataService
    .post({action: 'closeProject', "column": undefined, "row": undefined}, { startRow: this.minRow, endRow: this.maxRow })
    .pipe(take(1))
    .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
  }

  private deleteColumn(column: any) {
    this.dataService
    .post({action: 'deleteColumn', "column": column,"row": undefined}, { startRow: this.minRow, endRow: this.maxRow })
    .pipe(take(1))
    .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
  }

  private importDialog(component: ActionComponent) {
    this.dialogRef = this.dialog.open(ActionDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.component = component;
    this.dialogRef.afterClosed().pipe(take(1)).subscribe((confirm: any) => {
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
    this.dialogRef.afterClosed().pipe(take(1)).subscribe((dataForm: any) => {
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
    this.dialogRef.afterClosed().pipe(take(1)).subscribe((dataForm: any) => {
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
    this.dialogRef.afterClosed().pipe(take(1)).subscribe((dataForm: any) => {
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
    this.dialogRef.afterClosed().pipe(take(1)).subscribe((dataForm: any) => {
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

  private transformDialog(component: ActionComponent, selectedRow?: any, selectedColumn?: any) {
    this.dialogRef = this.dialog.open(ActionDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.component = component;
    this.dialogRef.afterClosed().pipe(take(1)).subscribe((dataForm: any) => {
      if (dataForm) {
        dataForm.column = (selectedColumn !== undefined) ? selectedColumn : this.selectedColumn;
        dataForm.row = (selectedRow !== undefined) ? selectedRow : this.selectedRow;
        this.transformService
          .post(dataForm, { startRow: this.minRow, endRow: this.maxRow })
          .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
      }
    });
  }
  /*FIN DIALOGS*/
}
