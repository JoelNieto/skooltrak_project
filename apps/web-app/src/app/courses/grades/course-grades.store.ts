import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { GradeObject, Period, Table } from '@skooltrak/models';
import { filter, from, map, switchMap, tap } from 'rxjs';

import { CoursesStore } from '../courses.store';

type State = {
  periods: Period[];
  selectedPeriod: string | undefined;
  loading: boolean;
  grades: Partial<GradeObject>[];
};

@Injectable()
export class CourseGradesStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private courseStore = inject(CoursesStore);
  private supabase = inject(SupabaseService);

  public course = this.courseStore.selected;

  public periods = this.selectSignal((state) => state.periods);
  public period = this.selectSignal((state) => state.selectedPeriod);
  private selectedPeriod$ = this.select((state) => state.selectedPeriod);

  private readonly fetchGrades = this.effect(() => {
    return this.selectedPeriod$.pipe(
      filter((period_id) => !!period_id),
      tap(() => this.patchState({ loading: true })),
      switchMap((period_id) => {
        return from(
          this.supabase.client
            .from(Table.Grades)
            .select(
              'id, title, period:periods(id, name), bucket:grade_buckets(*), start_at, items:grade_items(*)'
            )
            .eq('course_id', this.course()?.id)
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
              (grades) => this.patchState({ grades }),
              (error) => console.error(error),
              () => this.patchState({ loading: false })
            )
          );
      })
    );
  });

  private readonly fetchPeriods = this.effect(() => {
    return (
      tap(() => this.patchState({ loading: true })),
      from(
        this.supabase.client
          .from(Table.Periods)
          .select('id, name, year, start_at, end_at, school_id')
          .eq('school_id', this.course()?.school_id)
      )
        .pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          })
        )
        .pipe(
          tapResponse(
            (periods) => this.patchState({ periods }),
            (error) => {
              console.error(error);
            },
            () => this.patchState({ loading: false })
          )
        )
    );
  });

  ngrxOnStoreInit = () =>
    this.setState({
      loading: false,
      periods: [],
      selectedPeriod: this.course()?.period_id,
      grades: [],
    });
}
