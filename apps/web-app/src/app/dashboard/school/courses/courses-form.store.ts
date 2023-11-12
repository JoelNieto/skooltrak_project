import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { StudyPlan, Subject, Table } from '@skooltrak/models';
import { exhaustMap, from, of } from 'rxjs';

type State = {
  SUBJECTS: Subject[];
  PLANS: Partial<StudyPlan>[];
};

@Injectable()
export class CoursesFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly auth = inject(authState.AuthStateFacade);

  public readonly supabase = inject(SupabaseService);
  public readonly SUBJECTS = this.selectSignal((state) => state.SUBJECTS);
  public readonly PLANS = this.selectSignal((state) => state.PLANS);

  private readonly fetchPlans = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.StudyPlans)
        .select('id,name')
        .eq('school_id', this.auth.CURRENT_SCHOOL_ID())
        .order('year', { ascending: true }),
    )
      .pipe(
        exhaustMap(({ data, error }) => {
          if (error) throw new Error(error.message);
          return of(data as Partial<StudyPlan>[]);
        }),
      )
      .pipe(
        tapResponse(
          (PLANS) => this.patchState({ PLANS }),
          (error) => console.error(error),
        ),
      );
  });

  private readonly fetchSubjects = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.Subjects)
        .select(
          'id,name, short_name, code, description, created_at, user:users(full_name)',
        )
        .eq('school_id', this.auth.CURRENT_SCHOOL_ID())
        .order('name', { ascending: true }),
    )
      .pipe(
        exhaustMap(({ data, error }) => {
          if (error) throw new Error(error.message);
          return of(data as unknown as Subject[]);
        }),
      )
      .pipe(
        tapResponse(
          (SUBJECTS) => this.patchState({ SUBJECTS }),
          (error) => console.error(error),
        ),
      );
  });

  public ngrxOnStoreInit = (): void =>
    this.setState({ SUBJECTS: [], PLANS: [] });
}
