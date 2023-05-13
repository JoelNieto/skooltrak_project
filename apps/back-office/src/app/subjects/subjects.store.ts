import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Subject } from '@skooltrak/models';
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';

type State = {
  subjects: Subject[];
  loading: boolean;
  count: number;
  selected?: string | undefined;
};

@Injectable()
export class SubjectsStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private supabase = inject(SupabaseService);
  private snackBar = inject(MatSnackBar);

  readonly subjects = this.selectSignal((state) => state.subjects);
  readonly count = this.selectSignal((state) => state.count);
  readonly selectedId = this.selectSignal((state) => state.selected);
  readonly selected = this.selectSignal((state) =>
    state.selected ? state.subjects.find((x) => x.id === state.selected) : null
  );

  private readonly setSubjects = this.updater((state, subjects: Subject[]) => ({
    ...state,
    subjects,
  }));
  private readonly setCount = this.updater((state, count: number) => ({
    ...state,
    count,
  }));

  private readonly addSubject = this.updater(
    (state, subject: Subject): State => ({
      ...state,
      ...{ subjects: [...state.subjects, subject] },
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

  readonly fetchSubjects = this.effect(() => {
    return from(
      this.supabase.client.from('subject').select('*', { count: 'exact' })
    ).pipe(
      switchMap(({ data, error, count }) => {
        if (error) throw new Error(error.message);
        return of({ subjects: data, count });
      }),
      tap(({ count }) => this.setCount(count!)),
      map(({ subjects }) => this.setSubjects(subjects as Subject[])),
      tap(() => this.setLoading(false)),
      catchError((error) => {
        console.error(error);
        this.setLoading(false);
        return of([]);
      })
    );
  });

  readonly saveSubject = this.effect(
    (request$: Observable<Partial<Subject>>) => {
      return request$.pipe(
        tap(() => this.setLoading(true)),
        switchMap((request) =>
          from(
            this.supabase.client
              .from('subject')
              .upsert([request])
              .select('*')
              .single()
          ).pipe(
            switchMap(({ data, error }) => {
              if (error) throw new Error(error.message);
              return of(data);
            })
          )
        ),
        tap((subject) => this.addSubject(subject as Subject)),
        tap((subject) => this.setSelected(subject['id'])),
        tap(() => this.snackBar.open('Changes saved!', 'Close')),
        catchError((error) => {
          console.error(error);
          this.setLoading(false);
          return of();
        })
      );
    }
  );

  ngrxOnStoreInit = () =>
    this.setState({ subjects: [], loading: true, count: 0 });
}
