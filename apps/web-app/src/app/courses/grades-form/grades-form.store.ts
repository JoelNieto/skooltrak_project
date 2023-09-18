import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Grade, GradeBucket, Table } from '@skooltrak/models';
import { AlertService } from '@skooltrak/ui';
import { EMPTY, filter, from, map, Observable, switchMap, tap } from 'rxjs';

type State = {
  grade: Partial<Grade> | undefined;
  course_id: string | undefined;
  buckets: GradeBucket[];
  loading: boolean;
};

@Injectable()
export class GradesFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private supabase = inject(SupabaseService);
  private alert = inject(AlertService);

  private course_id$ = this.select((state) => state.course_id);

  public readonly buckets = this.selectSignal((state) => state?.buckets);

  private readonly fetchBuckets = this.effect(
    (course_id$: Observable<string | undefined>) => {
      return course_id$.pipe(
        filter((id) => !!id),
        tap(() => this.patchState({ loading: true })),
        switchMap((id) => {
          return from(
            this.supabase.client
              .from(Table.GradeBuckets)
              .select('id, course_id, name, weighing')
              .eq('course_id', id)
          )
            .pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);
                return data;
              })
            )
            .pipe(
              tapResponse(
                (buckets) => this.patchState({ buckets }),
                (error) => console.error(error),
                () => this.patchState({ loading: false })
              )
            );
        })
      );
    }
  );

  readonly fetchGrade = this.effect((request_id$: Observable<string>) => {
    return request_id$.pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap((id) =>
        from(
          this.supabase.client
            .from(Table.Grades)
            .select('id, course_id, start_at, bucket_id, period_id, published')
            .eq('id', id)
            .single()
        )
          .pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return data;
            })
          )
          .pipe(
            tapResponse(
              (grade) => this.patchState({ grade }),
              (error) => console.error(error),
              () => this.patchState({ loading: false })
            )
          )
      )
    );
  });

  readonly createGrade = this.effect((request$: Observable<Partial<Grade>>) => {
    return request$.pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap((grade) => {
        return from(this.supabase.client.from(Table.Grades).insert([grade]))
          .pipe(
            map(({ error }) => {
              if (error) throw new Error(error.message);
              return EMPTY;
            })
          )
          .pipe(
            tapResponse(
              () =>
                this.alert.showAlert({ icon: 'success', message: 'Created' }),
              (error) => console.error(error),
              () => this.patchState({ loading: false })
            )
          );
      })
    );
  });

  ngrxOnStoreInit = () => {
    this.setState({
      buckets: [],
      course_id: undefined,
      loading: false,
      grade: undefined,
    });
    this.fetchBuckets(this.course_id$);
  };
}
