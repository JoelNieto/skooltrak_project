import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ClassGroup, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { AlertService } from '@skooltrak/ui';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  groups: ClassGroup[];
  count: number;
  pageSize: number;
  start: number;
  loading: boolean;
};

const initialState: State = {
  groups: [],
  loading: true,
  count: 0,
  pageSize: 5,
  start: 0,
};

export const SchoolGroupsStore = signalStore(
  withState(initialState),
  withComputed(({ start, pageSize }, auth = inject(webStore.AuthStore)) => ({
    end: computed(() => start() + (pageSize() - 1)),
    schoolId: computed(() => auth.schoolId()),
  })),
  withMethods(
    (
      { start, end, schoolId, ...store },

      supabase = inject(SupabaseService),
      alert = inject(AlertService),
    ) => ({
      fetchGroups: rxMethod<number>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => patchState(store, { loading: true })),
          switchMap(() => {
            return from(
              supabase.client
                .from(Table.Groups)
                .select(
                  'id, name, plan:school_plans(*), plan_id, degree_id, teachers:users!group_teachers(id, first_name, father_name, email, avatar_url), degree:school_degrees(*), created_at, updated_at',
                  {
                    count: 'exact',
                  },
                )
                .range(start(), end())
                .eq('school_id', schoolId()),
            ).pipe(
              map(({ data, error, count }) => {
                if (error) throw new Error(error.message);

                return { groups: data as unknown as ClassGroup[], count };
              }),
              tap(({ count }) => !!count && patchState(store, { count })),
              tapResponse(
                ({ groups }) => patchState(store, { groups }),
                (error) => console.error(error),
                () => patchState(store, { loading: false }),
              ),
            );
          }),
        ),
      ),
      async saveGroup(request: Partial<ClassGroup>): Promise<void> {
        const { error } = await supabase.client
          .from(Table.Groups)
          .upsert([{ ...request, school_id: schoolId() }]);
        if (error) {
          console.error(error);

          return;
        }
        alert.showAlert({
          icon: 'success',
          message: 'ALERT.SUCCESS',
        });
        this.fetchGroups(start());
      },
      async deleteGroup(id: string): Promise<void> {
        const { error } = await supabase.client
          .from(Table.Groups)
          .delete()
          .eq('id', id);
        if (error) {
          alert.showAlert({ icon: 'error', message: 'ALERT.FAILURE' });
          console.error(error);

          return;
        }

        alert.showAlert({
          icon: 'success',
          message: 'ALERT.SUCCESS',
        });
        this.fetchGroups(start);
      },
    }),
  ),
  withHooks({
    onInit({ fetchGroups, end }) {
      fetchGroups(end);
    },
  }),
);
