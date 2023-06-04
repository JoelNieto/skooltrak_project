import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {
  getPages = (count: number, pageSize: number) =>
    Math.ceil(count / pageSize) + 1;
}
