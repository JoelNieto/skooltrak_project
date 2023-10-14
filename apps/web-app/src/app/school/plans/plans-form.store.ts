import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { Degree, Table } from '@skooltrak/models';
import { from, map } from 'rxjs';

type State = {
  DEGREES: Degree[];
};

@Injectable()
export class PlansFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  auth = inject(authState.AuthStateFacade);
  supabase = inject(SupabaseService);
  readonly DEGREES = this.selectSignal((state) => state.DEGREES);

  readonly fetchDegrees = this.effect(() => {
    return from(
      this.supabase.client
        .from(Table.Degrees)
        .select('id, name, level_id')
        .eq('school_id', this.auth.CURRENT_SCHOOL_ID())
    )
      .pipe(
        map(({ data, error }) => {
          if (error) throw new Error(error.message);
          return data as Degree[];
        })
      )
      .pipe(
        tapResponse(
          (DEGREES) => this.patchState({ DEGREES }),
          (error) => console.error(error)
        )
      );
  });
  ngrxOnStoreInit = () => this.setState({ DEGREES: [] });
}
