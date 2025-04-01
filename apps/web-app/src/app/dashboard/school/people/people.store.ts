import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { ClassGroup, RoleEnum, StatusEnum, Table, UserProfile } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, pipe, tap } from 'rxjs';

type State = {
  loading: boolean;
  people: UserProfile[];
  selectedStatus: StatusEnum | 'all';
  selectedRole: RoleEnum | 'all';
  count: number;
  pageSize: number;
  start: number;
  sortDirection: 'asc' | 'desc' | '';
  sortColumn: string;
  userId: string | undefined;
  groups: Partial<ClassGroup>[];
};

const initialState: State = {
  loading: false,
  people: [],
  selectedStatus: 'all',
  selectedRole: 'all',
  count: 0,
  pageSize: 5,
  start: 0,
  sortColumn: '',
  sortDirection: '',
  userId: undefined,
  groups: [],
};

export const SchoolPeopleStore = signalStore(
  { protectedState: false }, withState(initialState),
  withComputed(
    (
      {
        selectedRole,
        selectedStatus,
        start,
        pageSize,
        sortColumn,
        sortDirection,
      },
      auth = inject(webStore.AuthStore),
    ) => ({
      fetchData: computed(() => ({
        role: selectedRole(),
        status: selectedStatus(),
        schoolId: auth.schoolId(),
        end: start() + (pageSize() - 1),
        sortDirection: sortDirection(),
        sortColumn: sortColumn(),
      })),
    }),
  ),
  withMethods(
    (
      {
        fetchData,
        selectedRole,
        selectedStatus,
        sortColumn,
        sortDirection,
        start,
        userId,
        ...state
      },
      supabase = inject(SupabaseService),
      toast = inject(MatSnackBar),
      translate = inject(TranslateService),
    ) => {
      const fetchPeople = rxMethod<typeof fetchData>(
        pipe(
          filter(() => !!fetchData().schoolId),
          tap(() => getPeople()),
        ),
      );

      async function getPeople(): Promise<void> {
        patchState(state, { loading: true });
        let query = supabase.client
          .from(Table.SchoolUsers)
          .select(
            'user_id, role, status, created_at, group_id, group:school_groups(name), user:users(first_name, middle_name, father_name, mother_name, document_id, email, avatar_url)',
            {
              count: 'exact',
            },
          )
          .range(start(), fetchData().end)
          .eq('school_id', fetchData().schoolId);
        query =
          selectedRole() !== 'all' ? query.eq('role', selectedRole()) : query;
        query =
          selectedStatus() !== 'all'
            ? query.eq('status', selectedStatus())
            : query;

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
          people: data as UserProfile[],
          count: count ?? 0,
          loading: false,
        });
      }

      async function fetchGroups(): Promise<void> {
        const { error, data } = await supabase.client
          .from(Table.Groups)
          .select(
            'id, name, plan:school_plans(*), plan_id, degree_id, teachers:users!group_teachers(id, first_name, father_name, email, avatar_url), degree:school_degrees(*), created_at, updated_at',
          )
          .eq('school_id', fetchData().schoolId);

        if (error) {
          console.error(error);

          return;
        }
        patchState(state, { groups: data as Partial<ClassGroup>[] });
      }
      async function savePerson(request: Partial<UserProfile>): Promise<void> {
        patchState(state, { loading: true });
        const { status, role, group_id } = request;
        const { error } = await supabase.client
          .from(Table.SchoolUsers)
          .update({ status, role, group_id })
          .eq('user_id', userId())
          .eq('school_id', fetchData().schoolId);

        if (error) {
          console.error(error);
          toast.open(translate.instant('ALERT.FAILURE'));
          patchState(state, { loading: false });

          return;
        }
        patchState(state, { loading: false });
        toast.open(translate.instant('ALERT.SUCCESS'));
        getPeople();
      }

      return { fetchPeople, getPeople, fetchGroups, savePerson };
    },
  ),
  withHooks({
    onInit({ fetchData, fetchPeople }) {
      fetchPeople(fetchData);
    },
  }),
);
