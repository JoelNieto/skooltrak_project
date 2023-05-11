import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { School } from '@skooltrak/models';
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';

type State = {
  schools: School[];
  loading: boolean;
  selected?: string | undefined;
};

@Injectable()
export class SchoolsStore extends ComponentStore<State> implements OnStoreInit {
  private supabase = inject(SupabaseService);

  readonly schools$ = this.select((state) => state.schools);
  readonly selectedId$ = this.select((state) => state.selected);
  readonly selected$ = this.select((state) =>
    state.selected ? state.schools.find((x) => x.id === state.selected) : null
  );

  private readonly setSchools = this.updater((state, schools: School[]) => ({
    ...state,
    schools,
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
      this.supabase.client.from('school').select('*, country(id, name)')
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) throw new Error(error.message);
        return of(data);
      }),
      catchError((error) => {
        console.error(error);
        this.setLoading(false);
        return of([]);
      }),
      map((schools) => this.setSchools(schools as School[])),
      tap(() => this.setLoading(false))
    );
  });

  readonly createSchool = this.effect(
    (request$: Observable<Partial<School>>) => {
      return request$.pipe(
        tap(() => this.setLoading(true)),
        switchMap((request) =>
          from(
            this.supabase.client
              .from('school')
              .insert([request])
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
        tap((school) => this.setSelected(school['id']))
      );
    }
  );

  ngrxOnStoreInit = () => this.setState({ schools: [], loading: true });
}
