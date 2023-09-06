import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { ClassGroup, Table } from '@skooltrak/models';
import { from, map, tap } from 'rxjs';

import { CoursesStore } from '../courses.store';

type State = {
  groups: Partial<ClassGroup>[];
  loading: boolean;
};

@Injectable()
export class CourseGradesStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private courseStore = inject(CoursesStore);
  private supabase = inject(SupabaseService);

  private course = this.courseStore.selected;

  public groups = this.selectSignal((state) => state.groups);

  readonly fetchCourses = this.effect(() => {
    return (
      tap(() => this.patchState({ loading: true })),
      from(
        this.supabase.client
          .from(Table.Groups)
          .select('id, name, plan_id, degree_id')
          .eq('plan_id', this.course()?.plan_id)
      )
        .pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          })
        )
        .pipe(
          tapResponse(
            (groups) => this.patchState({ groups }),
            (error) => {
              console.error(error);
            },
            () => this.patchState({ loading: false })
          )
        )
    );
  });

  ngrxOnStoreInit = () => this.setState({ groups: [], loading: false });
}
