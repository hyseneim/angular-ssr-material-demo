/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
import { DataSource } from '@angular/cdk';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { ExampleDatabase } from '../database/example-database';
import { UserData } from '../model/user-data.model';
import { MdPaginator, MdSort } from '@angular/material';

export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(
    private _exampleDatabase: ExampleDatabase,
    private _paginator: MdPaginator,
    private _sort: MdSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserData[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._paginator.page,
      this._filterChange,
      this._sort.mdSortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = this._exampleDatabase.data.slice();

      let doSort = true;
      if (!this._sort.active || this._sort.direction === '') {
        doSort = false;
      }

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      if (doSort) {
        data.sort((a, b) => {
          let propertyA: number|string = '';
          let propertyB: number|string = '';

          switch (this._sort.active) {
            case 'userId': {
              [propertyA, propertyB] = [a.id, b.id];
              break;
            }
            case 'userName': {
              [propertyA, propertyB] = [a.name, b.name];
              break;
            }
            case 'progress': {
              [propertyA, propertyB] = [a.progress, b.progress];
              break;
            }
            case 'color': {
              [propertyA, propertyB] = [a.color, b.color];
              break;
            }
          }

          const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

          return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
      }

      return data.filter((item: UserData) => {
        const searchStr = (item.id + item.color + item.name + (item.progress + '%')).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      })
      .splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() {
    this._filterChange.unsubscribe();
  }
}
