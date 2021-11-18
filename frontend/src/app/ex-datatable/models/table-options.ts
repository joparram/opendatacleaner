export interface EXTableOptions {
  pageRows: number;
  headerMenu?: EXTableHeaderMenu;
}

export interface EXTableHeaderMenu {
  menuItems: EXMenuItemOption[];
}

export interface EXMenuItemOption {
  title: string;
  function?: Function;
  menu?: EXMenuItemOption;
}
