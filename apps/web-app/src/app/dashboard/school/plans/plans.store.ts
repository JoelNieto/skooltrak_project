import { computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Degree, StudyPlan, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { ConfirmationService } from '@skooltrak/ui';
import { debounceTime, filter, pipe, tap } from 'rxjs';

type State = {
  plans: StudyPlan[];
  count: number;
  pageSize: number;
  start: number;
  loading: boolean;
  sortDirection: 'asc' | 'desc' | '';
  sortColumn: string;
  degrees: Degree[];
};

const initialState: State = {
  plans: [],
  loading: true,
  count: 0,
  pageSize: 5,
  start: 0,
  sortColumn: '',
  sortDirection: '',
  degrees: [],
};

export const SchoolPlansStore = signalStore(
  withState(initialState),
  withComputed(
    (
      { start, pageSize, sortDirection, sortColumn },
      auth = inject(webStore.AuthStore),
    ) => {
      const end = computed(() => start() + (pageSize() - 1));
      const fetchData = computed(() => ({
        pageSize: pageSize(),
        end: end(),
        sortColumn: sortColumn(),
        sortDirection: sortDirection(),
        schoolId: auth.schoolId(),
      }));

      return { end, fetchData };
    },
  ),
  withMethods(
    (
      { start, end, fetchData, ...state },
      supabase = inject(SupabaseService),
      toast = inject(MatSnackBar),
      dialog = inject(MatDialog),
      confirmation = inject(ConfirmationService),
      translate = inject(TranslateService),
    ) => {
      async function getPlans(): Promise<void> {
        patchState(state, { loading: true });

        let query = supabase.client
          .from(Table.StudyPlans)
          .select(
            'id,name, level:levels(*), level_id, degree_id, degree:school_degrees(*), year, created_at',
            {
              count: 'exact',
            },
          )
          .range(start(), end())
          .eq('school_id', fetchData().schoolId);

        if (fetchData().sortColumn) {
          query = query.order(fetchData().sortColumn, {
            ascending: fetchData().sortDirection !== 'desc',
          });
        }

        const { data, error, count } = await query;

        if (error) {
          console.error(error);

          patchState(state, { loading: false });
        }

        patchState(state, {
          count: count ?? 0,
          plans: data as unknown as StudyPlan[],
          loading: false,
        });
      }

      const fetchPlans = rxMethod<typeof fetchData>(
        pipe(
          debounceTime(250),
          filter(() => !!fetchData().schoolId),
          tap(() => getPlans()),
        ),
      );
      async function savePlan(request: Partial<StudyPlan>): Promise<void> {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.StudyPlans)
          .upsert([{ ...request, school_id: fetchData().schoolId }]);

        if (error) {
          console.error(error);
          patchState(state, { loading: true });
          toast.open(translate.instant('ALERT.FAILURE'));

          return;
        }
        toast.open(translate.instant('ALERT.SUCCESS'));
        dialog.closeAll();
        fetchPlans(fetchData);
      }

      async function deletePlan(id: string): Promise<void> {
        patchState(state, { loading: true });
        const res = await confirmation.openDialogPromise({
          title: 'CONFIRMATION.DELETE.TITLE',
          description: 'CONFIRMATION.DELETE.TEXT',
          icon: 'delete',
          color: 'warn',
          confirmButtonText: 'CONFIRMATION.DELETE.CONFIRM',
          cancelButtonText: 'CONFIRMATION.DELETE.CANCEL',
          showCancelButton: true,
        });

        if (!res) {
          patchState(state, { loading: false });

          return;
        }
        const { error } = await supabase.client
          .from(Table.StudyPlans)
          .delete()
          .eq('id', id);

        if (error) {
          toast.open(translate.instant('ALERT.FAILURE'));
          console.error(error);

          return;
        }

        toast.open(translate.instant('ALERT.SUCCESS'));
        fetchPlans(fetchData);
      }

      async function fetchDegrees(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Degrees)
          .select('id, name, level_id')
          .eq('school_id', fetchData().schoolId);

        if (error) {
          console.error(error);

          return;
        }
        patchState(state, { degrees: data });
      }

      return { deletePlan, savePlan, fetchPlans, fetchDegrees };
    },
  ),
  withHooks({
    onInit({ fetchPlans, fetchData }) {
      fetchPlans(fetchData);
    },
  }),
);
