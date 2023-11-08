import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { GradeObject, Period, Table } from '@skooltrak/models';
import { filter, from, map, switchMap, tap } from 'rxjs';

import { CoursesStore } from '../courses.store';

type State = {
  PERIODS: Period[];
  SELECTED_PERIOD: string | undefined;
  LOADING: boolean;
  GRADES: Partial<GradeObject>[];
};

@Injectable()
export class CourseGradesStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly courseStore = inject(CoursesStore);
  private readonly supabase = inject(SupabaseService);

  public COURSE = this.courseStore.SELECTED;

  public readonly PERIODS = this.selectSignal((state) => state.PERIODS);
  public readonly PERIOD = this.selectSignal((state) => state.SELECTED_PERIOD);
  private readonly SELECTED_PERIOD$ = this.select(
    (state) => state.SELECTED_PERIOD
  );

  private readonly fetchGrades = this.effect(() => {
    return this.SELECTED_PERIOD$.pipe(
      filter((period_id) => !!period_id),
      tap(() => this.patchState({ LOADING: true })),
      switchMap((period_id) => {
        return from(
          this.supabase.client
            .from(Table.Grades)
            .select(
              'id, title, period:periods(id, name), bucket:grade_buckets(*), start_at, items:grade_items(*)'
            )
            .eq('course_id', this.COURSE()?.id)
            .eq('period_id', period_id)
        )
          .pipe(
            map(({ data, error }) => {
              if (error) throw new Error(error.message);
              return data as Partial<GradeObject>[];
            })
          )
          .pipe(
            tapResponse(
              (GRADES) => this.patchState({ GRADES }),
              (error) => console.error(error),
              () => this.patchState({ LOADING: false })
            )
          );
      })
    );
  });

  private readonly fetchPeriods = this.effect(() => {
    return (
      tap(() => this.patchState({ LOADING: true })),
      from(
        this.supabase.client
          .from(Table.Periods)
          .select('id, name, year, start_at, end_at, school_id')
          .eq('school_id', this.COURSE()?.school_id)
      )
        .pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          })
        )
        .pipe(
          tapResponse(
            (PERIODS) => this.patchState({ PERIODS }),
            (error) => {
              console.error(error);
            },
            () => this.patchState({ LOADING: false })
          )
        )
    );
  });

  public ngrxOnStoreInit = (): void =>
    this.setState({
      LOADING: false,
      PERIODS: [],
      SELECTED_PERIOD: this.COURSE()?.period_id,
      GRADES: [],
    });
}
