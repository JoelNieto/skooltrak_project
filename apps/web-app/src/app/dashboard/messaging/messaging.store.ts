import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { SupabaseService } from '@skooltrak/auth';
import { Channel, Table } from '@skooltrak/models';
import { from, map, switchMap } from 'rxjs';

type State = {
  LOADING: boolean;
  CHANNELS: Channel[];
};

@Injectable()
export class MessagingStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private supabase = inject(SupabaseService);
  public LOADING = this.selectSignal((state) => state.LOADING);
  public CHANNELS = this.selectSignal((state) => state.CHANNELS);

  private readonly fetchChannels = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      switchMap(() =>
        from(
          this.supabase.client
            .from(Table.Channels)
            .select(
              '*, members:channel_members(user_id, user:users(*), permission, created_at)',
            ),
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);

            return data;
          }),
          tapResponse(
            (CHANNELS) => this.patchState({ CHANNELS }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false }),
          ),
        ),
      ),
    );
  });

  public ngrxOnStoreInit = (): void => {
    this.setState({ LOADING: false, CHANNELS: [] });
    this.fetchChannels();
  };
}
