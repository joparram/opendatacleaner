import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'logger',
  templateUrl: './ex-logger.component.html',
  styleUrls: ['./ex-logger.component.scss'],
})
export class ExLoggerComponent implements OnInit {
  logs: any = [];
  maxLogs = 7;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {}

  public addWarningLog(log: string) {
    this.logs.push({ message: log, type: 'warning' });
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    this.ref.detectChanges();
  }

  public addErrorLog(log: string) {
    const date = new Date();
    this.logs.push({ message: log, type: 'error', date: date.toLocaleDateString() + ' ' + date.toLocaleTimeString() });
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    this.ref.detectChanges();
  }

  public addInfoLog(log: string) {
    const date = new Date();
    this.logs.push({ message: log, type: 'info', date: date.toLocaleDateString() + ' ' + date.toLocaleTimeString() });
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    this.ref.detectChanges();
  }

  public clearLogs() {
    this.logs = [];
  }
}
