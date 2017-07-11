import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { DataSource } from '@angular/cdk';

import { MdPaginator } from '@angular/material';
import { MdSort } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { ExampleDatabase } from './database/example-database';
import { ExampleDataSource } from './datasource/example-datasource';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  displayedColumns = ['userId', 'userName', 'progress', 'color'];

  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;

  @ViewChild('filter') filter: ElementRef;

  @ViewChild(MdPaginator) paginator: MdPaginator;

  @ViewChild(MdSort) sort: MdSort;

  ngOnInit() {
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

}
