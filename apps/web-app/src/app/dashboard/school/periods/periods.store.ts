import { computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Period, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { orderBy } from 'lodash';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  loading: boolean;
  periods: Period[];
  sort_column: string;
  sort_direction: 'asc' | 'desc' | '';
};

const initialState: State = {
  loading: false,
  periods: [],
  sort_column: '',
  sort_direction: '',
};

export const SchoolPeriodsStore = signalStore(
  { protectedState: false }, withState(initialState),
  withComputed(
    (
      { sort_direction, sort_column, periods },
      auth = inject(webStore.AuthStore),
    ) => {
      const schoolId = computed(() => auth.schoolId());

      const sortedItems = computed(() =>
        sort_direction() !== ''
          ? orderBy(periods(), [sort_column()], [sort_direction() as any])
          : periods(),
      );

      return { schoolId, sortedItems };
    },
  ),
  withMethods(
    (
      { schoolId, ...state },
      supabase = inject(SupabaseService),
      toast = inject(MatSnackBar),
      dialog = inject(MatDialog),
      translate = inject(TranslateService),
    ) => ({
      fetchPeriods: rxMethod<string | undefined>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => patchState(state, { loading: true })),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Periods)
                .select('*')
                .eq('school_id', schoolId())
                .order('start_at', { ascending: true }),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);

                return data as Period[];
              }),
              tapResponse({
                next: (periods) => patchState(state, { periods }),
                error: console.error,
                finalize: () => patchState(state, { loading: false }),
              }),
            ),
          ),
        ),
      ),
      async savePeriod(request: Partial<Period>): Promise<void> {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.Periods)
          .upsert([{ ...request, school_id: schoolId() }]);

        if (error) {
          toast.open(translate.instant('ALERT.FAILURE'));
          console.error(error);
          patchState(state, { loading: false });

          return;
        }
        toast.open(translate.instant('ALERT.SUCCESS'));
        patchState(state, { loading: false });
        this.fetchPeriods(schoolId);
        dialog.closeAll();
      },
    }),
  ),
  withHooks({
    onInit({ fetchPeriods, schoolId }) {
      fetchPeriods(schoolId);
    },
  }),
);
