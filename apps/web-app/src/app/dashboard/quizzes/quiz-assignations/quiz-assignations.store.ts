import { computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Course, Quiz, QuizAssignation, Table } from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { filter, pipe, tap } from 'rxjs';

type State = {
  loading: boolean;
  assignations: QuizAssignation[];
  count: number;
  pageSize: number;
  start: number;
  courses: Course[];
  quizzes: Partial<Quiz>[];
  sortDirection: 'asc' | 'desc' | '';
  sortColumn: string;
};

const initial: State = {
  loading: false,
  assignations: [],
  count: 0,
  pageSize: 5,
  start: 0,
  courses: [],
  quizzes: [],
  sortDirection: 'desc',
  sortColumn: 'created_at',
};

export const QuizAssignationsStore = signalStore(
  withState(initial),
  withComputed(
    (
      { start, pageSize, sortDirection, sortColumn },
      auth = inject(webStore.AuthStore),
    ) => {
      const end = computed(() => start() + (pageSize() - 1));
      const schoolId = computed(() => auth.schoolId());
      const fetchData = computed(() => ({
        start: start(),
        pageSize: pageSize(),
        schoolId: schoolId(),
        sortColumn: sortColumn(),
        sortDirection: sortDirection(),
      }));

      return { end, fetchData, schoolId };
    },
  ),
  withMethods(
    (
      { schoolId, end, start, sortColumn, sortDirection, fetchData, ...state },
      supabase = inject(SupabaseService),
      toast = inject(MatSnackBar),
      dialog = inject(MatDialog),
      translate = inject(TranslateService),
    ) => {
      const fetchAssignations = rxMethod<typeof fetchData>(
        pipe(
          filter(() => !!schoolId()),
          tap(() => getAssignations()),
        ),
      );

      async function getAssignations(): Promise<void> {
        patchState(state, { loading: false });
        let query = supabase.client
          .from(Table.QuizAssignations)
          .select(
            'id, quiz_id, quiz:quizzes(*), course_id, course:courses(id, subject:school_subjects(id, name), plan:school_plans(id, name)), minutes, school_id, hidden, start_date, end_date, created_at, user:users(id, first_name, father_name, email)',
            { count: 'exact' },
          )
          .eq('school_id', schoolId())
          .range(start(), end());

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
          assignations: data as unknown as QuizAssignation[],
          count: count ?? 0,
        });
      }

      async function getCourses(): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from(Table.Courses)
          .select(
            'id, subject:school_subjects(id, name), subject_id, plan:school_plans(id, name, year), plan_id',
          )
          .eq('school_id', schoolId())
          .order('subject(name)', { ascending: true })
          .order('plan(year)', { ascending: true });

        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, {
          courses: data as unknown as Course[],
          loading: false,
        });
      }
      async function getQuizzes(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Quizzes)
          .select('id, title')
          .eq('school_id', schoolId())
          .order('title', { ascending: true });

        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { quizzes: data });
      }

      async function saveAssignation(
        request: Partial<QuizAssignation>,
      ): Promise<void> {
        patchState(state, { loading: true });
        const { error } = await supabase.client
          .from(Table.QuizAssignations)
          .upsert([{ ...request, school_id: schoolId() }]);

        if (error) {
          console.error(error);
          toast.open(translate.instant('ALERT.FAILURE'));
          patchState(state, { loading: false });

          return;
        }

        toast.open(translate.instant('ALERT.SUCCESS'));
        patchState(state, { loading: false });
        dialog.closeAll();
      }

      async function deleteAssignation(id: string): Promise<void> {
        const { error } = await supabase.client
          .from(Table.QuizAssignations)
          .delete()
          .eq('id', id);

        if (error) {
          console.error(error);
          toast.open(translate.instant('ALERT.FAILURE'));

          return;
        }
        toast.open(translate.instant('ALERT.SUCCESS'));
      }

      return {
        fetchAssignations,
        deleteAssignation,
        getAssignations,
        getCourses,
        getQuizzes,
        saveAssignation,
      };
    },
  ),
  withHooks({
    onInit({ fetchAssignations, fetchData }) {
      fetchAssignations(fetchData);
    },
  }),
);
