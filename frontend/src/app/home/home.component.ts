import { Component, HostListener, Input, ViewChild, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { GridOptions, IDatasource, IGetRowsParams, ColDef } from 'ag-grid';
import { AgGridAngular } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { QuoteService } from './quote.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', ],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  public columnDefs: any[];
  public rowData: any[];
  public gridOptions: any;
  public info: string;
  @ViewChild('grid') grid: AgGridAngular;


  constructor(private quoteService: QuoteService) {

    this.columnDefs = [
      { headerName: 'One', field: 'one' },
      { headerName: 'Two', field: 'two' },
      { headerName: 'Three', field: 'three' }
    ];

    this.gridOptions = {
      rowSelection: 'single',
      cacheBlockSize: 100,
      maxBlocksInCache: 2,
      enableServerSideFilter: false,
      enableServerSideSorting: false,
      rowModelType: 'infinite',
      pagination: true,
      paginationAutoPageSize: true
    };

  }
  private getRowData(startRow: number, endRow: number): Observable<any[]> {
    // This is acting as a service call that will return just the
    // data range that you're asking for.
    var rowdata = [];
    for (var i = startRow; i <= endRow; i++) {
      rowdata.push({ one: "hello", two: "world", three: "Item " + i });
    }
    return of(rowdata);
  }

  onGridReady(params: any) {
    console.log("onGridReady");
    var datasource = {
      getRows: (params: IGetRowsParams) => {
        this.info = "Getting datasource rows, start: " + params.startRow + ", end: " + params.endRow;

        this.getRowData(params.startRow, params.endRow)
                  .subscribe(data => params.successCallback(data));

      }
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
