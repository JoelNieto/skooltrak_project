import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Grade, GradeBucket, Table } from '@skooltrak/models';
import { AlertService } from '@skooltrak/ui';
import { EMPTY, filter, from, map, Observable, switchMap, tap } from 'rxjs';

type State = {
  GRADE: Partial<Grade> | undefined;
  COURSE_ID: string | undefined;
  BUCKETS: GradeBucket[];
  LOADING: boolean;
};

@Injectable()
export class GradesFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private supabase = inject(SupabaseService);
  private alert = inject(AlertService);

  private COURSE_ID$ = this.select((state) => state.COURSE_ID);

  public readonly BUCKETS = this.selectSignal((state) => state?.BUCKETS);

  private readonly fetchBuckets = this.effect(
    (COURSE_ID$: Observable<string | undefined>) => {
      return COURSE_ID$.pipe(
        filter((id) => !!id),
        tap(() => this.patchState({ LOADING: true })),
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
                (BUCKETS) => this.patchState({ BUCKETS }),
                (error) => console.error(error),
                () => this.patchState({ LOADING: false })
              )
            );
        })
      );
    }
  );

  public readonly fetchGrade = this.effect(
    (request_id$: Observable<string>) => {
      return request_id$.pipe(
        tap(() => this.patchState({ LOADING: true })),
        switchMap((id) =>
          from(
            this.supabase.client
              .from(Table.Grades)
              .select(
                'id, course_id, start_at, bucket_id, period_id, published'
              )
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
                (GRADE) => this.patchState({ GRADE }),
                (error) => console.error(error),
                () => this.patchState({ LOADING: false })
              )
            )
        )
      );
    }
  );

  public readonly createGrade = this.effect(
    (request$: Observable<Partial<Grade>>) => {
      return request$.pipe(
        tap(() => this.patchState({ LOADING: true })),
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
                () => this.patchState({ LOADING: false })
              )
            );
        })
      );
    }
  );

  public ngrxOnStoreInit = (): void => {
    this.setState({
      BUCKETS: [],
      COURSE_ID: undefined,
      LOADING: false,
      GRADE: undefined,
    });
    this.fetchBuckets(this.COURSE_ID$);
  };
}
