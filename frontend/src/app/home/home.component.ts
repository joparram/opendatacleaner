import { Component, HostListener, Input, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { GridOptions, IDatasource, IGetRowsParams, ColDef } from 'ag-grid';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { QuoteService } from './quote.service';
import { ImportService } from '@app/@shared/services/import.service';
import { MenuService } from '@app/@shared/services/menu.service';

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
  @ViewChild('grid') grid: AgGridAngular;

  constructor(private quoteService: QuoteService, private importService: ImportService, private menuService: MenuService) {

    this.menuService.menu$.subscribe(event => {
        switch(event.action) {
          case "import":
            break;
          default:
            break;
        }
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
    this.columnDefs = [
      { headerName: 'One', field: 'one' },
      { headerName: 'Two', field: 'two' },
      { headerName: 'Three', field: 'three' },
    ];

    this.gridOptions = {
      rowSelection: 'single',
      cacheBlockSize: 100,
      maxBlocksInCache: 2,
      enableServerSideFilter: false,
      enableServerSideSorting: false,
      rowModelType: 'infinite',
      pagination: true,
      paginationAutoPageSize: true,
      defaultColDef: {
        cellStyle: (params: any) => {
          console.log(params.colDef);
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
  // public onSelectionChanged (event: any) {
  //   console.log(event);
  // }
  private getRowData(startRow: number, endRow: number): Observable<any[]> {
    // This is acting as a service call that will return just the
    // data range that you're asking for.
    var rowdata = [];
    for (var i = startRow; i <= endRow; i++) {
      rowdata.push({ one: 'hello', two: 'world', three: 'Item ' + i });
    }
    return of(rowdata);
  }

  onGridReady(params: any) {
    console.log('onGridReady');
    var datasource = {
      getRows: (params: IGetRowsParams) => {
        this.info = 'Getting datasource rows, start: ' + params.startRow + ', end: ' + params.endRow;
        console.log(this.info);
        this.getRowData(params.startRow, params.endRow).subscribe((data) => params.successCallback(data));
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
