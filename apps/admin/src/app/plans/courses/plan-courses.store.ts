/* eslint-disable rxjs/finnish */
import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { state, SupabaseService } from '@skooltrak/auth';
import { Course, Table } from '@skooltrak/models';
import { EMPTY, exhaustMap, filter, from, map, Observable, of, switchMap, tap, withLatestFrom } from 'rxjs';

import { PlansStore } from '../plans.store';

type State = {
  loading: boolean;
  courses: Course[];
};

@Injectable()
export class PlanCourseStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  supabase = inject(SupabaseService);
  store = inject(Store);
  planStore = inject(PlansStore);
  readonly school = this.store.selectSignal(
    state.selectors.selectCurrentSchool
  );
  readonly fetchData$ = this.select(
    { planId: this.planStore.selectedId$ },
    { debounce: true }
  );
  readonly courses = this.selectSignal((state) => state.courses);
  readonly loading = this.selectSignal((state) => state.loading);

  readonly fetchCourses = this.effect(
    (data$: Observable<{ planId: string | undefined }>) => {
      return data$.pipe(
        map(({ planId }) => planId),
        filter((planId) => !!planId),
        tap(() => this.patchState({ loading: true })),
        exhaustMap((planId) => {
          return from(
            this.supabase.client
              .from(Table.Courses)
              .select(
                'id, subject:school_subjects(id, name), subject_id, plan:school_plans(id, name), plan_id, description, weekly_hours, created_at'
              )
              .eq('school_id', this.school()?.id)
              .eq('plan_id', planId)
          ).pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return data;
            }),
            tapResponse(
              (courses) =>
                this.patchState({ courses: courses as unknown as Course[] }),
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

  readonly saveCourse = this.effect((request$: Observable<Partial<Course>>) => {
    return request$.pipe(
      tap(() => this.patchState({ loading: true })),
      withLatestFrom(this.planStore.selectedId$),
      switchMap(([request, plan_id]) => {
        return from(
          this.supabase.client
            .from(Table.Courses)
            .upsert([{ ...request, school_id: this.school()?.id, plan_id }])
        ).pipe(
          exhaustMap(({ error }) => {
            if (error) throw new Error(error.message);
            return of(EMPTY);
          })
        );
      }),
      tapResponse(
        () => this.fetchCourses(this.fetchData$),
        (error) => console.error(error),
        () => this.patchState({ loading: false })
      )
    );
  });

  ngrxOnStoreInit = () => {
    this.setState({ loading: false, courses: [] });
    this.fetchCourses(this.fetchData$);
  };
}
