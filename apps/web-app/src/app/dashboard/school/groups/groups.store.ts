import { computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { ClassGroup, Degree, StudyPlan, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type State = {
  groups: ClassGroup[];
  count: number;
  pageSize: number;
  start: number;
  loading: boolean;
  sortDirection: 'asc' | 'desc' | '';
  sortColumn: string;
  degrees: Degree[];
  degreeId: string;
  plans: Partial<StudyPlan>[]
};

const initialState: State = {
  groups: [],
  loading: true,
  count: 0,
  pageSize: 5,
  start: 0,
  sortColumn: '',
  sortDirection: '',
  degrees: [],
  degreeId: '',
  plans: []
};

export const SchoolGroupsStore = signalStore(
  withState(initialState),
  withComputed(
    (
      { start, pageSize, sortColumn, sortDirection },
      auth = inject(webStore.AuthStore),
    ) => {
      const end = computed(() => start() + (pageSize() - 1));
      const schoolId = computed(() => auth.schoolId());
      const query = computed(() => ({
        schoolId: schoolId(),
        pageSize: pageSize(),
        start: start(),
        sortDirection: sortDirection(),
        sortColumn: sortColumn(),
      }));

      return { end, schoolId, query };
    },
  ),
  withMethods(
    (
      { start, end, schoolId, query, sortColumn, sortDirection, degreeId, ...state },
      supabase = inject(SupabaseService),
      toast = inject(MatSnackBar),
      dialog = inject(MatDialog),
      translate = inject(TranslateService),
    ) => {
      const fetchGroups = rxMethod<typeof query>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => getGroups()),
        ),
      );

      async function getGroups(): Promise<void> {
        patchState(state, { loading: true });
        let query = supabase.client
          .from(Table.Groups)
          .select(
            'id, name, plan:school_plans(id, year, name), plan_id, degree_id, teachers:users!group_teachers(id, first_name, father_name, email, avatar_url), degree:school_degrees(*), created_at, updated_at',
            {
              count: 'exact',
            },
          )
          .range(start(), end())
          .eq('school_id', schoolId());

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

        !!count && patchState(state, { count });
        patchState(state, {
          groups: data as unknown as ClassGroup[],
          loading: false,
        });
      }
      async function saveGroup(request: Partial<ClassGroup>): Promise<void> {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.Groups)
          .upsert([{ ...request, school_id: schoolId() }]);

        if (error) {
          console.error(error);
          patchState(state, { loading: false });
          toast.open(translate.instant('ALERT.FAILURE'));

          return;
        }
        toast.open(translate.instant('ALERT.SUCCESS'));

        fetchGroups(query);
        dialog.closeAll();
      }
      async function deleteGroup(id: string): Promise<void> {
        const { error } = await supabase.client
          .from(Table.Groups)
          .delete()
          .eq('id', id);

        if (error) {
          toast.open(translate.instant('ALERT.FAILURE'));
          console.error(error);

          return;
        }

        toast.open(translate.instant('ALERT.SUCCESS'));
        fetchGroups(query);
      }

      async function fetchDegrees(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Degrees)
          .select('id, name, level:levels(id, name, sort)')
          .order('level(sort)', {ascending: true})
          .eq('school_id', schoolId());

        if (error) {
          console.error(error);
        }

        patchState(state, {degrees: data as unknown as Degree[]})
      }

      const fetchPlans = rxMethod<string>(
        pipe(
          filter(() => !!degreeId()),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.StudyPlans)
                .select('id,name')
                .eq('degree_id', degreeId()),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);

                return data;
              }),
              tapResponse({
                next: (plans) => patchState(state, { plans }),
                error: console.error,
              }),
            ),
          ),
        ),
      );

      return { fetchGroups, fetchDegrees, fetchPlans, deleteGroup, saveGroup, getGroups };
    },
  ),
  withHooks({
    onInit({ fetchGroups, fetchPlans, degreeId, query }) {
      fetchGroups(query);
      fetchPlans(degreeId);
    },
  }),
);
