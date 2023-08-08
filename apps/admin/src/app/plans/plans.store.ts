import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
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
  auth = inject(authState.AuthStateFacade);

  plans = this.selectSignal((state) => state.plans);
  selectedId$ = this.select((state) => state.selectedId);

  readonly fetchPlans = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.StudyPlans)
        .select('id, name, year, degree:school_degrees(name)')
        .eq('school_id', this.auth.currentSchoolId())
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
