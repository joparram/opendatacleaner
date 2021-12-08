export interface EXTableDatasource {
  getData(params: EXDatasourceParams): void;
}

export interface EXDatasourceParams {
  page: number;
  pageRows: number;
  firstRow?: number;
  lastRow?: number;
  totalRows?: number;
  totalPages?: number;
  readyData?: Function;
  setDatasource?: Function;
}
