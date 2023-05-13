import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { School } from '@skooltrak/models';
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';

type State = {
  schools: School[];
  loading: boolean;
  count: number;
  selected?: string | undefined;
};

@Injectable()
export class SchoolsStore extends ComponentStore<State> implements OnStoreInit {
  private supabase = inject(SupabaseService);
  private snackBar = inject(MatSnackBar);

  readonly schools = this.selectSignal((state) => state.schools);
  readonly count = this.selectSignal((state) => state.count);
  readonly selectedId = this.selectSignal((state) => state.selected);
  readonly selected = this.selectSignal((state) =>
    state.selected ? state.schools.find((x) => x.id === state.selected) : null
  );

  private readonly setSchools = this.updater((state, schools: School[]) => ({
    ...state,
    schools,
  }));
  private readonly setCount = this.updater((state, count: number) => ({
    ...state,
    count,
  }));

  private readonly addSchool = this.updater(
    (state, school: School): State => ({
      ...state,
      ...{ schools: [...state.schools, school] },
    })
  );

  readonly setSelected = this.updater(
    (state, selected: string | undefined): State => ({ ...state, selected })
  );

  private readonly setLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  readonly fetchSchools = this.effect(() => {
    return from(
      this.supabase.client
        .from('school')
        .select('*, country(id, name), profile(full_name)', { count: 'exact' })
    ).pipe(
      switchMap(({ data, error, count }) => {
        if (error) throw new Error(error.message);
        return of({ schools: data, count });
      }),
      tap(({ count }) => this.setCount(count!)),
      map(({ schools }) => this.setSchools(schools as School[])),
      tap(() => this.setLoading(false)),
      catchError((error) => {
        console.error(error);
        this.setLoading(false);
        return of([]);
      })
    );
  });

  readonly saveSchool = this.effect((request$: Observable<Partial<School>>) => {
    return request$.pipe(
      tap(() => this.setLoading(true)),
      switchMap((request) =>
        from(
          this.supabase.client
            .from('school')
            .upsert([request])
            .select('*, country(id, name)')
            .single()
        ).pipe(
          switchMap(({ data, error }) => {
            if (error) throw new Error(error.message);
            return of(data);
          })
        )
      ),
      tap((school) => this.addSchool(school as School)),
      tap((school) => this.setSelected(school['id'])),
      tap(() => this.snackBar.open('Changes saved!', 'Close')),
      catchError((error) => {
        console.error(error);
        this.setLoading(false);
        return of();
      })
    );
  });

  ngrxOnStoreInit = () =>
    this.setState({ schools: [], loading: true, count: 0 });
}
