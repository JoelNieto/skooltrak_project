import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Gender, Table } from '@skooltrak/models';
import { exhaustMap, from, of } from 'rxjs';

type State = {
  genders: Gender[];
};

@Injectable()
export class ProfileFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  supabase = inject(SupabaseService);
  readonly genders = this.selectSignal((state) => state.genders);

  readonly fetchGenders = this.effect(() => {
    return from(this.supabase.client.from(Table.Genders).select('id, name'))
      .pipe(
        exhaustMap(({ data, error }) => {
          if (error) throw new Error(error.message);
          return of(data);
        })
      )
      .pipe(
        tapResponse(
          (genders) => this.patchState({ genders: genders as Gender[] }),
          (error) => console.error(error)
        )
      );
  });
  ngrxOnStoreInit = () => this.setState({ genders: [] });
}
