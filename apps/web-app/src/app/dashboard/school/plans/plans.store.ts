import { computed, inject } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { StudyPlan, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  plans: StudyPlan[];
  count: number;
  pageSize: number;
  start: number;
  loading: boolean;
};

const initialState: State = {
  plans: [],
  loading: true,
  count: 0,
  pageSize: 5,
  start: 0,
};

export const SchoolPlansStore = signalStore(
  withState(initialState),
  withComputed(({ start, pageSize }) => ({
    end: computed(() => start() + (pageSize() - 1)),
  })),
  withMethods(
    (
      { start, end, ...store },
      auth = inject(webStore.AuthStore),
      supabase = inject(SupabaseService),
      toast = inject(HotToastService),
      translate = inject(TranslateService),
    ) => ({
      fetchPlans: rxMethod<number>(
        pipe(
          filter(() => !!auth.schoolId()),
          tap(() => patchState(store, { loading: true })),
          switchMap(() => {
            return from(
              supabase.client
                .from(Table.StudyPlans)
                .select(
                  'id,name, level:levels(*), level_id, degree_id, degree:school_degrees(*), year, created_at',
                  {
                    count: 'exact',
                  },
                )
                .order('year', { ascending: true })
                .range(start(), end())
                .eq('school_id', auth.schoolId()),
            ).pipe(
              map(({ data, error, count }) => {
                if (error) throw new Error(error.message);

                return { plans: data as unknown as StudyPlan[], count };
              }),
              tap(({ count }) => !!count && patchState(store, { count })),
              tapResponse(
                ({ plans }) => patchState(store, { plans }),
                (error) => console.error(error),
                () => patchState(store, { loading: false }),
              ),
            );
          }),
        ),
      ),
      async savePlan(request: Partial<StudyPlan>): Promise<void> {
        const { error } = await supabase.client
          .from(Table.StudyPlans)
          .upsert([{ ...request, school_id: auth.schoolId() }]);
        if (error) {
          console.error(error);
          toast.error(translate.instant('ALERT.FAILURE'));

          return;
        }
        toast.success(translate.instant('ALERT.SUCCESS'));
        this.fetchPlans(start());
      },
      async deletePlan(id: string): Promise<void> {
        const { error } = await supabase.client
          .from(Table.StudyPlans)
          .delete()
          .eq('id', id);
        if (error) {
          toast.error(translate.instant('ALERT.FAILURE'));
          console.error(error);

          return;
        }

        toast.success(translate.instant('ALERT.SUCCESS'));
        this.fetchPlans(start);
      },
    }),
  ),
  withHooks({
    onInit({ fetchPlans, end }) {
      fetchPlans(end);
    },
  }),
);
