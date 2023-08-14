/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { addDays, format, setHours, setMinutes } from 'date-fns';

@Injectable()
export class UtilService {
  getPages = (count: number, pageSize: number) =>
    Math.ceil(count / pageSize) + 1;

  searchFilter(
    array: Array<any>,
    args: Array<string>,
    searchText: string
  ): Array<any> {
    const filterArray: Array<any> = [];

    searchText = searchText.toLocaleLowerCase();

    for (const item of array) {
      let term = '';
      for (const col of args) {
        term = term + this.isNullString(this.getProperty(item, col));
      }
      term = term.toLocaleLowerCase();
      if (term.indexOf(searchText) >= 0) {
        filterArray.push(item);
      }
    }
    return filterArray;
  }

  isNullString(str?: string): string {
    return str || '';
  }

  getProperty(item: any, property: string): string {
    property?.split('.').forEach((e) => {
      item = item ? item[e] : '';
    });
    return item;
  }

  sortBy(array: Array<any>, args: string, desc?: boolean): Array<any> {
    if (desc) {
      array.sort((a: any, b: any) => {
        if (!a[args]) {
          return 1;
        } else if (!b[args]) {
          return -1;
        } else if (a[args] < b[args]) {
          return 1;
        } else if (a[args] > b[args]) {
          return -1;
        } else {
          return 0;
        }
      });
    } else {
      array.sort((a: any, b: any) => {
        if (!a[args]) {
          return -1;
        } else if (!b[args]) {
          return 1;
        } else if (a[args] < b[args]) {
          return -1;
        } else if (a[args] > b[args]) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return array;
  }

  formateDate = (date: Date) =>
    format(setHours(setMinutes(addDays(date, 1), 0), 7), "yyyy-MM-dd'T'HH:mm");
}
