import { inject, Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, messagingState, SupabaseService } from '@skooltrak/auth';
import { Message, Table } from '@skooltrak/models';
import { filter, from, map, Observable, switchMap, tap } from 'rxjs';

type State = {
  LOADING: boolean;
  MESSAGES: Message[];
};

@Injectable()
export class ChatStore extends ComponentStore<State> implements OnStoreInit {
  private readonly supabase = inject(SupabaseService);
  private auth = inject(authState.AuthStateFacade);
  private readonly store = inject(messagingState.MessagingStateFacade);
  public readonly MESSAGES = this.selectSignal((state) => state.MESSAGES);
  public LOADING = this.selectSignal((state) => state.LOADING);

  private readonly fetchMessages = this.effect(
    (chat_id$: Observable<string | undefined>) =>
      chat_id$.pipe(
        filter((chat_id) => !!chat_id),
        tap(() => this.patchState({ LOADING: true })),
        switchMap((chat_id) =>
          from(
            this.supabase.client
              .from(Table.Messages)
              .select('id, user_id, text, user:users(*), sent_at')
              .order('sent_at', { ascending: false })
              .eq('chat_id', chat_id),
          ).pipe(
            map(({ error, data }) => {
              if (error) throw new Error(error.message);
              return data.map((x) => ({
                ...x,
                mine: x.user_id === this.auth.USER_ID(),
              })) as Message[];
            }),
            tapResponse(
              (messages) => this.patchState({ MESSAGES: messages }),
              (error) => console.error(error),
              () => this.patchState({ LOADING: false }),
            ),
          ),
        ),
      ),
  );

  public readonly sendMessage = this.effect((text$: Observable<string>) =>
    text$.pipe(
      switchMap((text) =>
        from(
          this.supabase.client
            .from(Table.Messages)
            .insert([{ chat_id: this.store.SELECTED_ID(), text }])
            .select('id, user_id, text, user:users(*), sent_at')
            .single(),
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data as Message;
          }),
          tapResponse(
            (message) =>
              this.patchState({
                MESSAGES: [{ mine: true, ...message }, ...this.MESSAGES()],
              }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false }),
          ),
        ),
      ),
    ),
  );

  public ngrxOnStoreInit = (): void => {
    this.setState({ LOADING: false, MESSAGES: [] });
    this.fetchMessages(this.store.selected_id$);
  };
}
