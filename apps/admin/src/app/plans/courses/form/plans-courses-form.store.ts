import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { state, SupabaseService } from '@skooltrak/auth';
import { Subject, Table } from '@skooltrak/models';
import { exhaustMap, from, of } from 'rxjs';

type State = {
  subjects: Subject[];
};

@Injectable()
export class PlansCoursesFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  store = inject(Store);
  school = this.store.selectSignal(state.selectors.selectCurrentSchool);
  supabase = inject(SupabaseService);
  readonly subjects = this.selectSignal((state) => state.subjects);

  readonly fetchSubjects = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.Subjects)
        .select(
          'id,name, short_name, code, description, created_at, user:users(full_name)'
        )
        .eq('school_id', this.school()?.id)
    )
      .pipe(
        exhaustMap(({ data, error }) => {
          if (error) throw new Error(error.message);
          return of(data as unknown as Subject[]);
        })
      )
      .pipe(
        tapResponse(
          (subjects) => this.patchState({ subjects }),
          (error) => console.error(error)
        )
      );
  });
  ngrxOnStoreInit = () => this.setState({ subjects: [] });
}
