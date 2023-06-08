import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { state, SupabaseService } from '@skooltrak/auth';
import { Degree } from '@skooltrak/models';
import { exhaustMap, from, of } from 'rxjs';

type State = {
  degrees: Degree[];
};

@Injectable()
export class PlansFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  store = inject(Store);
  school = this.store.selectSignal(state.selectors.selectCurrentSchool);
  supabase = inject(SupabaseService);
  readonly degrees = this.selectSignal((state) => state.degrees);

  readonly fetchDegrees = this.effect(() => {
    return from(
      this.supabase.client
        .from('school_degrees')
        .select('id, name, level_id')
        .eq('school_id', this.school()?.id)
    )
      .pipe(
        exhaustMap(({ data, error }) => {
          if (error) throw new Error(error.message);
          return of(data);
        })
      )
      .pipe(
        tapResponse(
          (degrees) => this.patchState({ degrees: degrees as Degree[] }),
          (error) => console.error(error)
        )
      );
  });
  ngrxOnStoreInit = () => this.setState({ degrees: [] });
}
