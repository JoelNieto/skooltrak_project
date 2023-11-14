import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Level, Table } from '@skooltrak/models';
import { from, map, switchMap, tap } from 'rxjs';

type State = {
  LOADING: boolean;
  LEVELS: Partial<Level>[];
};

@Injectable()
export class DegreesFormStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private readonly supabase = inject(SupabaseService);

  public readonly LOADING = this.selectSignal((state) => state.LOADING);
  public readonly LEVELS = this.selectSignal((state) => state.LEVELS);

  private readonly fetchLevels = this.effect<void>((trigger$) =>
    trigger$
      .pipe(
        tap(() => this.patchState({ LOADING: true })),
        switchMap(() =>
          from(
            this.supabase.client
              .from(Table.Levels)
              .select('id, name')
              .order('sort'),
          ).pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return data as Level[];
            }),
          ),
        ),
      )
      .pipe(
        tapResponse(
          (LEVELS) => this.patchState({ LEVELS }),
          (error) => console.error(error),
          () => this.patchState({ LOADING: true }),
        ),
      ),
  );

  public ngrxOnStoreInit = (): void => {
    this.setState({
      LOADING: false,
      LEVELS: [],
    });
    this.fetchLevels();
  };
}
