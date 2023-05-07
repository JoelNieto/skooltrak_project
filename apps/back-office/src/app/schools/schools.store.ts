import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { School } from '@skooltrak/models';
import { catchError, map, of, tap } from 'rxjs';

import { SchoolsService } from './schools.service';

type State = {
  schools: School[];
  loading: boolean;
  selected?: string | undefined;
};

@Injectable()
export class SchoolsStore extends ComponentStore<State> implements OnStoreInit {
  private service = inject(SchoolsService);

  readonly schools$ = this.select((state) => state.schools);
  readonly selectedId$ = this.select((state) => state.selected);
  readonly selected$ = this.select((state) =>
    state.selected ? state.schools.find((x) => x._id === state.selected) : null
  );

  private readonly setSchools = this.updater((state, schools: School[]) => ({
    ...state,
    schools,
  }));

  readonly setSelected = this.updater(
    (state, selected: string | undefined): State => ({ ...state, selected })
  );

  readonly fetchSchools = this.effect(() => {
    return this.service.getAll().pipe(
      catchError((error) => {
        console.error(error);
        this.setLoading(false);
        return of([]);
      }),
      map((schools) => this.setSchools(schools)),
      tap(() => this.setLoading(false))
    );
  });

  private readonly setLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  ngrxOnStoreInit = () => this.setState({ schools: [], loading: true });
}
