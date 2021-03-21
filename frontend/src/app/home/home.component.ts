import { Component, HostListener, Input, ViewChild, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { GridOptions, IDatasource, IGetRowsParams, ColDef } from 'ag-grid';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable, Subscription } from 'rxjs';
import { of } from 'rxjs';
import { QuoteService } from './quote.service';
import { ImportService } from '@app/@shared/services/import.service';
import { DatabaseExporterService } from '@app/@shared/services/databaseexporter.service';

import { ProcessorService } from '@app/@shared/services/processor.service';
import { MenuService } from '@app/@shared/services/menu.service';
import { PaginatedDataService } from '@app/@shared/services/paginateddata.service';
import { DataService } from '@app/@shared/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionComponent } from '@app/@shared/models/action-component';
import { ActionDialogComponent } from '@shared/components/component-dialog/action-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  public columnDefs: any[];
  public rowData: any[];
  public gridOptions: any;
  public info: string;
  types: any;
  rowFunctions: any[];
  columnFunctions: any[];
  selectedColumn: any;
  selectedRow: any;
  dialogRef: any;
  minRow: number = 0;
  maxRow: number = 100;
  dataSubscription: Subscription = new Subscription();

  @ViewChild('grid') grid: AgGridAngular;

  constructor(
    private quoteService: QuoteService,
    private importService: ImportService,
    private processorService: ProcessorService,
    private menuService: MenuService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private paginateddataservice: PaginatedDataService,
    private dataService: DataService,
    private databaseexporterService: DatabaseExporterService
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
        case 'databaseexporter':
          this.databaseexporterService.get().subscribe((component: ActionComponent) => {
            this.databaseExporterDialog(component);
          });
          break;
        default:
          break;
      }
    });
    this.paginateddataservice.columns$.subscribe((columns: any) => {
      this.columnDefs = columns;
    });
    this.paginateddataservice.data$.subscribe((data: any) => {
      console.log(data);
    });
    this.paginateddataservice.types$.subscribe((types: any) => {
      this.types = types;
      console.log(this.types);
    });
    this.rowFunctions = [
      {
        name: 'Eliminar Fila',
        updated: 'Elimina una fila del dataset',
      },
    ];
    this.columnFunctions = [
      {
        name: 'Eliminar propiedad',
        updated: 'Elimina una columna',
      },
    ];

    this.gridOptions = {
      rowSelection: 'single',
      cacheBlockSize: 100,
      maxBlocksInCache: 1,
      rowModelType: 'infinite',
      pagination: true,
      paginationAutoPageSize: true,
      onCellValueChanged: (e: any) => this.updateCellValue(e),
      onCellFocused: (e: any) => {
        this.selectedColumn = e.column.colId;
        this.selectedRow = e.rowIndex;
      },
      defaultColDef: {
        cellStyle: (params: any) => {
          if (params.colDef === this.selectedColumn) {
            return { 'background-color': '#b7e4ff' };
          }
        },
        editable: true,
        // make every column use 'text' filter by default
        filter: 'agTextColumnFilter',
      },
    };
  }
  getSelectedColumnType() {
    if (this.types != undefined) {
      return this.types[this.selectedColumn];
    }
  }

  click(event: any) {
    this.menuService.updateMenuEvents(event);
  }
  updateCellValue(e: any) {
    let dataForm = {
      column: e.colDef.field,
      row: e.rowIndex,
      action: 'updateCell',
      value: e.value,
    };
    this.dataService
      .post(dataForm, { startRow: this.minRow, endRow: this.maxRow })
      .subscribe((data: any) => this.paginateddataservice.updateDataEvents(data));
  }
  onGridReady(params: any) {
    console.log('onGridReady');
    var datasource = {
      getRows: (params: IGetRowsParams) => {
        this.dataSubscription.unsubscribe();
        this.info = 'Getting datasource rows, start: ' + params.startRow + ', end: ' + params.endRow;
        console.log(this.info);
        this.dataSubscription = this.paginateddataservice.data$.subscribe((data: any) => {
          this.rowData = data;
          params.successCallback(this.rowData);
          this.ref.detectChanges();
        });
        this.paginateddataservice.get({ startRow: params.startRow, endRow: params.endRow }).subscribe((data: any) => {
          this.paginateddataservice.updateDataEvents(data);
        });
      },
    };
    params.api.setDatasource(datasource);
  }

  ngOnInit() {
    this.isLoading = true;
    this.quoteService
      .getRandomQuote({ category: 'dev' })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });
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
  /*FIN DIALOGS*/
}
