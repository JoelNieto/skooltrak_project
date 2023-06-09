import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { state, SupabaseService } from '@skooltrak/auth';
import { StudyPlan, Table } from '@skooltrak/models';
import { exhaustMap, from, of } from 'rxjs';

type State = {
  loading: boolean;
  plans: Partial<StudyPlan>[];
  selectedId?: string;
  selected?: StudyPlan;
};

@Injectable()
export class PlansStore extends ComponentStore<State> implements OnStoreInit {
  private supabase = inject(SupabaseService);
  store = inject(Store);
  school = this.store.selectSignal(state.selectors.selectCurrentSchool);

  plans = this.selectSignal((state) => state.plans);

  fetchCourses$ = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.StudyPlans)
        .select('id, name, year, degree:school_degrees(name)')
        .eq('school_id', this.school()?.id)
    )
      .pipe(
        exhaustMap(({ data, error }) => {
          if (error) throw new Error(error.message);
          return of(data as unknown as Partial<StudyPlan>[]);
        })
      )
      .pipe(
        tapResponse(
          (plans) => this.patchState({ plans }),
          (error) => console.error(error),
          () => this.patchState({ loading: false })
        )
      );
  });
  ngrxOnStoreInit = () => this.setState({ loading: true, plans: [] });
}
