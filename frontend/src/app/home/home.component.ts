import { Component, HostListener, Input, ViewChild, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { GridOptions, IDatasource, IGetRowsParams, ColDef } from 'ag-grid';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable, Subscription } from 'rxjs';
import { of } from 'rxjs';
import { QuoteService } from './quote.service';
import { ImportService } from '@app/@shared/services/import.service';
import { MenuService } from '@app/@shared/services/menu.service';
import { DataService } from '@app/@shared/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionComponent } from '@app/@shared/models/action-component';
import { ActionDialogComponent } from '@shared/components/component-dialog/action-dialog.component';
import { PortalInjector } from '@angular/cdk/portal';

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
  rowFunctions: any[];
  columnFunctions: any[];
  selectedColumn: any;
  dialogRef: any;
  minRow: number = 0;
  maxRow: number = 100;
  dataSubscription: Subscription = new Subscription();

  @ViewChild('grid') grid: AgGridAngular;

  constructor(
    private quoteService: QuoteService,
    private importService: ImportService,
    private menuService: MenuService,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private dataservice: DataService
  ) {
    this.menuService.menu$.subscribe((event) => {
      switch (event.action) {
        case 'import':
          this.importService.get().subscribe((component: ActionComponent) => {
            this.pruebaDialog(component);
          });
          break;
        default:
          break;
      }
    });
    this.dataservice.columns$.subscribe((columns: any) => {
      this.columnDefs = columns;
    });
    this.dataservice.data$.subscribe((data: any) => {
      console.log(data);
    });
    this.dataservice.types$.subscribe((types: any) => {});
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
      enableServerSideFilter: false,
      enableServerSideSorting: false,
      rowModelType: 'infinite',
      pagination: true,
      paginationAutoPageSize: true,
      defaultColDef: {
        cellStyle: (params: any) => {
          // console.log(params.colDef);
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

  private pruebaDialog(component: ActionComponent) {
    this.dialogRef = this.dialog.open(ActionDialogComponent, {
      disableClose: false,
    });
    this.dialogRef.componentInstance.component = component;
    this.dialogRef.afterClosed().subscribe((confirm: any) => {
      if (confirm) {
        this.importService
          .post(confirm, { startRow: this.minRow, endRow: this.maxRow })
          .subscribe((data: any) => this.dataservice.updateDataEvents(data));
      }
    });
  }

  onGridReady(params: any) {
    console.log('onGridReady');
    var datasource = {
      getRows: (params: IGetRowsParams) => {
        this.dataSubscription.unsubscribe();
        this.info = 'Getting datasource rows, start: ' + params.startRow + ', end: ' + params.endRow;
        console.log(this.info);
        this.dataSubscription = this.dataservice.data$.subscribe((data: any) => {
          this.rowData = data;
          params.successCallback(this.rowData);
          this.ref.detectChanges();
        });
        this.dataservice.get({ startRow: params.startRow, endRow: params.endRow }).subscribe((data) => {
          this.dataservice.updateDataEvents(data);
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
}
