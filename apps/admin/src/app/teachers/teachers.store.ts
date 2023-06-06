import { inject, Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { state, SupabaseService } from '@skooltrak/auth';
import { Teacher } from '@skooltrak/models';
import { concatMap, exhaustMap, filter, from, of, tap } from 'rxjs';

type State = {
  teachers: Teacher[];
  count: number;
  pageSize: number;
  start: number;
  end: number;
  loading: boolean;
};

@Injectable()
export class TeacherStore extends ComponentStore<State> implements OnStoreInit {
  store = inject(Store);
  school = this.store.selectSignal(state.selectors.selectCurrentSchool);
  supabase = inject(SupabaseService);

  readonly count = this.selectSignal((state) => state.count);
  readonly loading = this.selectSignal((state) => state.loading);
  readonly pageSize = this.selectSignal((state) => state.pageSize);
  readonly start$ = this.select((state) => state.start);
  readonly end$ = this.select((state) => state.end);

  setRange = this.updater((state, start: number) => ({
    ...state,
    start: start,
    end: start + (state.pageSize - 1),
  }));

  readonly queryData$ = this.select(
    {
      start: this.start$,
      end: this.end$,
      pageSize: toObservable(this.pageSize),
    },
    { debounce: true }
  );

  private readonly fetchTeachers = this.effect(
    (data$: typeof this.queryData$) => {
      return data$.pipe(
        tap(() => this.patchState({ loading: true })),
        filter(({ end }) => end > 0),
        concatMap(({ start, end }) => {
          return from(
            this.supabase.client
              .from('teachers')
              .select(
                'id, first_name, middle_name, father_name, mother_name, subjects, created_at, updated_at',
                { count: 'exact' }
              )
              .order('first_name', { ascending: true })
              .range(start, end)
              .eq('school_id', this.school()?.id)
          ).pipe(
            exhaustMap(({ data, error, count }) => {
              if (error) throw new Error(error.message);
              return of({ teachers: data, count });
            }),
            tap(({ count }) => this.patchState({ count: count! })),
            tapResponse(
              ({ teachers }) =>
                this.patchState({ teachers: teachers as Teacher[] }),
              (error) => {
                console.error(error);
                return of([]);
              },
              () => this.patchState({ loading: false })
            )
          );
        })
      );
    }
  );

  ngrxOnStoreInit = () => {
    this.setState({
      teachers: [],
      loading: true,
      count: 0,
      pageSize: 5,
      start: 0,
      end: 4,
    });
    this.fetchTeachers(this.queryData$);
  };
}