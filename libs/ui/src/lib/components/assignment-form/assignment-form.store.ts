import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { state, SupabaseService } from '@skooltrak/auth';
import { AssignmentType, Course, Table } from '@skooltrak/models';
import { exhaustMap, from, map, of } from 'rxjs';

type State = {
  types: AssignmentType[];
  courses: Course[];
};

@Injectable()
export class AssignmentFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  store$ = inject(Store);
  school = this.store$.selectSignal(state.selectors.selectCurrentSchool);
  supabase = inject(SupabaseService);
  readonly types = this.selectSignal((state) => state.types);
  readonly courses = this.selectSignal((state) => state.courses);

  readonly fetchDegrees = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.AssignmentTypes)
        .select('id, name, is_urgent, is_summative')
    )
      .pipe(
        exhaustMap(({ data, error }) => {
          if (error) throw new Error(error.message);
          return of(data as AssignmentType[]);
        })
      )
      .pipe(
        tapResponse(
          (types) => this.patchState({ types }),
          (error) => console.error(error)
        )
      );
  });

  private readonly fetchCourses = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.Courses)
        .select(
          'id, subject:school_subjects(id, name), subject_id, teachers:users!course_teachers(id, first_name, father_name, email, avatar_url), plan:school_plans(id, name, year), plan_id, description, weekly_hours, created_at'
        )
        .eq('school_id', this.school()?.id)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as unknown as Course[];
      }),
      tapResponse(
        (courses) => this.patchState({ courses }),
        (error) => {
          console.error(error);
          return of([]);
        }
      )
    );
  });

  ngrxOnStoreInit = () => this.setState({ types: [], courses: [] });
}
