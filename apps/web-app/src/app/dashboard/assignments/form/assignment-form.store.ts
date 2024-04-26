import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
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
import {
  Assignment,
  AssignmentType,
  Attachment,
  ClassGroup,
  Course,
  GroupAssignment,
  Table,
} from '@skooltrak/models';
import { SupabaseService, webStore } from '@skooltrak/store';
import { orderBy, pick } from 'lodash';
import { distinctUntilChanged, filter, from, map, pipe, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

type State = {
  assignment: Assignment | undefined;
  types: AssignmentType[];
  courses: Course[];
  courseId: string | undefined;
  dates: GroupAssignment[];
  loading: boolean;
  groups: Partial<ClassGroup>[];
};

const initialState: State = {
  assignment: undefined,
  types: [],
  courses: [],
  courseId: undefined,
  dates: [],
  loading: false,
  groups: [],
};

export const AssignmentFormStore = signalStore(
  withState(initialState),
  withComputed(({ courses, courseId }, auth = inject(webStore.AuthStore)) => ({
    schoolId: computed(() => auth.schoolId()),
    course: computed(() => courses().find((x) => x.id === courseId())),
  })),
  withMethods(
    (
      { schoolId, dates, course, ...state },
      supabase = inject(SupabaseService),
      toast = inject(MatSnackBar),
      translate = inject(TranslateService),
      router = inject(Router),
    ) => ({
      async fetchTypes(): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.AssignmentTypes)
          .select('id, name, is_urgent, is_summative')
          .order('name', { ascending: true });

        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { types: data as AssignmentType[] });
      },
      fetchCourses: rxMethod<string | undefined>(
        pipe(
          filter(() => !!schoolId()),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Courses)
                .select(
                  'id, subject:school_subjects(id, name), subject_id, plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at',
                )
                .eq('school_id', schoolId()),
            ).pipe(
              map(({ data, error }) => {
                if (error) throw new Error(error.message);

                return orderBy(data, [
                  'subject.name',
                  'plan.year',
                ]) as unknown as Course[];
              }),
              tapResponse({
                next: (courses) => patchState(state, { courses }),
                error: (error) => {
                  console.error(error);
                },
              }),
            ),
          ),
        ),
      ),
      async fetchAssignment(assignmentId: string): Promise<void> {
        const { data, error } = await supabase.client
          .from(Table.Assignments)
          .select('id,title,course_id,type_id,description,created_at,user_id')
          .eq('id', assignmentId)
          .single();

        if (error) {
          console.error(error);

          return;
        }

        patchState(state, { assignment: data, loading: false });
      },
      async saveAssignment({
        request,
        files,
      }: {
        request: Partial<Assignment>;
        files: File[];
      }): Promise<void> {
        patchState(state, { loading: false });
        const { data, error } = await supabase.client
          .from(Table.Assignments)
          .upsert([
            pick(request, [
              'id',
              'title',
              'description',
              'upload_file',
              'course_id',
              'type_id',
            ]),
          ])
          .select('id')
          .single();

        if (error) {
          console.error(error);
          patchState(state, { loading: false });
          toast.open(translate.instant('ALERT.FAILURE'));

          return;
        }
        try {
          await this.saveGroupsDate(data.id);
          await this.saveAttachments({ files, assignment_id: data.id });
        } catch (error) {
          console.error(error);
          patchState(state, { loading: false });
          toast.open(translate.instant('ALERT.FAILURE'));

          return;
        }

        toast.open(translate.instant('ALERT.SUCCESS'));
        router.navigate(['app', 'assignments', data.id]);
        patchState(state, { loading: false });
      },
      async saveAttachments({
        files,
        assignment_id,
      }: {
        files: File[];
        assignment_id: string;
      }): Promise<void> {
        if (!files.length) {
          return;
        }
        const items: Partial<Attachment>[] = [];

        await Promise.all(
          files.map(async (file) => {
            const { data, error } = await supabase.uploadFile({
              file,
              folder: schoolId()!,
            });
            items.push({
              file_name: file.name,
              file_path: data?.path,
              file_size: file.size,
              file_type: file.type,
            });

            if (error) {
              console.error(error);
              throw new Error(error.message);
            }
          }),
        );

        const { error, data } = await supabase.client
          .from(Table.Attachments)
          .insert(items)
          .select('id');

        if (error) {
          console.error(error);
          throw new Error(error.message);
        }

        const { error: failure } = await supabase.client
          .from(Table.AssignmentAttachments)
          .insert(data.map((x) => ({ attachment_id: x.id, assignment_id })));

        if (failure) {
          console.error(failure);

          return;
        }
      },
      async saveGroupsDate(id: string): Promise<void> {
        const groups = dates().map((x) => ({ ...x, assignment_id: id }));

        const { error } = await supabase.client
          .from(Table.GroupAssignments)
          .upsert(groups);

        if (error) {
          throw new Error(error.message);
        }
      },
      fetchGroups: rxMethod<Course | undefined>(
        pipe(
          distinctUntilChanged(),
          filter(() => !!course()),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Groups)
                .select(
                  'id, name, plan:school_plans(*), degree:school_degrees(*), created_at, updated_at',
                )
                .eq('plan_id', course()?.plan_id),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);

                return data as Partial<ClassGroup>[];
              }),
              tapResponse({
                next: (groups) => patchState(state, { groups }),
                error: console.error,
              }),
            ),
          ),
        ),
      ),
    }),
  ),
  withHooks({
    onInit({ fetchTypes, schoolId, fetchCourses, fetchGroups, course }) {
      fetchTypes();
      fetchCourses(schoolId);
      fetchGroups(course);
    },
  }),
);
