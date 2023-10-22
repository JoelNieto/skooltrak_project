import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { Degree, Table } from '@skooltrak/models';
import { from, map, switchMap } from 'rxjs';

type State = {
  DEGREES: Degree[];
};

@Injectable()
export class PlansFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly auth = inject(authState.AuthStateFacade);
  private readonly supabase = inject(SupabaseService);
  public readonly DEGREES = this.selectSignal((state) => state.DEGREES);

  private readonly fetchDegrees = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        from(
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
          )
      )
    )
  );

  public ngrxOnStoreInit = (): void => {
    this.setState({ DEGREES: [] });
    this.fetchDegrees();
  };
}
