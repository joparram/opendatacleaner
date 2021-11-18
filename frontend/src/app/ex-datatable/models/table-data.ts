export interface EXTableDatasource {
  getRows(params: EXDatasourceParams, success: Function, error: Function): void;
  onDestroy?(): void;
}

export interface EXDatasourceParams {
  page: number;
  pageRows: number;
  firstRow?: number;
  lastRow?: number;
  totalRows?: number;
  totalPages?: number;
}
