import { computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { ConfirmationService } from '@skooltrak/ui';
import { filter, pipe, tap } from 'rxjs';

type State = {
  subjects: Subject[];
  count: number;
  pageSize: number;
  start: number;
  queryText: string;
  loading: boolean;
  sortColumn: string;
  sortDirection: 'asc' | 'desc' | '';
};

const initialState: State = {
  subjects: [],
  loading: true,
  count: 0,
  pageSize: 5,
  queryText: '',
  start: 0,
  sortDirection: '',
  sortColumn: '',
};
export const SchoolSubjectsStore = signalStore(
  { protectedState: false }, withState(initialState),
  withComputed(
    (
      { start, pageSize, queryText, sortDirection, sortColumn },
      auth = inject(webStore.AuthStore),
    ) => ({
      end: computed(() => start() + (pageSize() - 1)),
      fetchData: computed(() => ({
        start: start(),
        text: queryText(),
        pageSize: pageSize(),
        schoolId: auth.schoolId(),
        sortDirection: sortDirection(),
        sortColumn: sortColumn(),
      })),
    }),
  ),
  withMethods(
    (
      { fetchData, end, sortColumn, sortDirection, ...state },
      supabase = inject(SupabaseService),
      snackBar = inject(MatSnackBar),
      dialog = inject(MatDialog),
      confirmation = inject(ConfirmationService),
      translate = inject(TranslateService),
    ) => {
      async function getSubjects(): Promise<void> {
        patchState(state, { loading: true });
        let query = supabase.client
          .from(Table.Subjects)
          .select(
            'id,name, short_name, code, description, created_at, user:users(full_name)',
            {
              count: 'exact',
            },
          )
          .range(fetchData().start, end())
          .eq('school_id', fetchData().schoolId)
          .or(
            `name.ilike.%${fetchData().text}%, short_name.ilike.%${
              fetchData().text
            }%, code.ilike.%${fetchData().text}%, description.ilike.%${
              fetchData().text
            }%`,
          );

        if (sortColumn()) {
          query = query.order(sortColumn(), {
            ascending: sortDirection() !== 'desc',
          });
        }

        const { data, error, count } = await query;

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, {
          loading: false,
          count: count ?? 0,
          subjects: data as unknown as Subject[],
        });
      }
      const fetchSubjects = rxMethod<typeof fetchData>(
        pipe(
          filter(() => !!fetchData().schoolId),
          tap(() => getSubjects()),
        ),
      );
      async function saveSubject(request: Partial<Subject>): Promise<void> {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.Subjects)
          .upsert([{ ...request, school_id: fetchData().schoolId }]);

        if (error) {
          snackBar.open(translate.instant('ALERT.FAILURE'));
          console.error(error);
          patchState(state, { loading: false });

          return;
        }
        snackBar.open(translate.instant('ALERT.SUCCESS'));
        dialog.closeAll();
        fetchSubjects(fetchData);
      }
      async function deleteSubject(id: string): Promise<void> {
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
          .from(Table.Subjects)
          .delete()
          .eq('id', id);

        if (error) {
          snackBar.open(translate.instant('ALERT.FAILURE'));
          console.error(error);
          patchState(state, { loading: false });

          return;
        }
        snackBar.open(translate.instant('ALERT.SUCCESS'));
        fetchSubjects(fetchData);
      }

      return { fetchSubjects, saveSubject, deleteSubject, getSubjects };
    },
  ),
  withHooks({
    onInit({ fetchData, fetchSubjects }) {
      fetchSubjects(fetchData);
    },
  }),
);
