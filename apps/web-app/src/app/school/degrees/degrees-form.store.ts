import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Level, Table } from '@skooltrak/models';
import { exhaustMap, from, map, tap } from 'rxjs';

type State = {
  loading: boolean;
  levels: Partial<Level>[];
};

@Injectable()
export class DegreesFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly supabase = inject(SupabaseService);

  readonly loading = this.selectSignal((state) => state.loading);
  readonly levels = this.selectSignal((state) => state.levels);

  readonly fetchLevels = this.effect<void>((trigger$) =>
    trigger$
      .pipe(
        tap(() => this.patchState({ loading: true })),
        exhaustMap(() =>
          from(this.supabase.client.from(Table.Levels).select('id, name')).pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return data as Level[];
            })
          )
        )
      )
      .pipe(
        tapResponse(
          (levels) => this.patchState({ levels }),
          (error) => console.error(error),
          () => this.patchState({ loading: true })
        )
      )
  );

  ngrxOnStoreInit = () => {
    this.setState({
      loading: false,
      levels: [],
    });
    this.fetchLevels();
  };
}
