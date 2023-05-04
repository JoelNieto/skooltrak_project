import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { School } from '@skooltrak/models';

@Injectable()
export class SchoolsService {
  private http = inject(HttpClient);

  public getAll = () => this.http.get<School[]>('/api/schools');
}
