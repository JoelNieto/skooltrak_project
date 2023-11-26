import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from '@ngrx/component-store';
import { authState, SupabaseService } from '@skooltrak/auth';
import { Chat, Table } from '@skooltrak/models';
import {
  filter,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

type State = {
  LOADING: boolean;
  CHATS: Chat[];
  CHAT_ID: string | undefined;
};

@Injectable()
export class MessagingStore
  extends ComponentStore<State>
  implements OnStoreInit
{
  private supabase = inject(SupabaseService);
  private auth = inject(authState.AuthStateFacade);
  private readonly router = inject(Router);
  public LOADING = this.selectSignal((state) => state.LOADING);
  public CHATS = this.selectSignal((state) => state.CHATS);
  public CHAT_ID = this.selectSignal((state) => state.CHAT_ID);
  public readonly chat_id$ = this.select((state) => state.CHAT_ID);
  public SELECTED = computed(() =>
    this.CHATS().find((x) => x.id === this.CHAT_ID()),
  );

  private readonly fetchChats = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      tap(() => this.patchState({ LOADING: true })),
      switchMap(() => this.auth.currentUser$),
      filter((user) => !!user),
      switchMap((user) =>
        from(
          this.supabase.client
            .from(Table.Chats)
            .select(
              '*, members:chat_members(user_id, user:users(*), created_at)',
            )
            .neq('members.user_id', user?.id),
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);

            return data;
          }),
          tapResponse(
            (CHATS) => this.patchState({ CHATS }),
            (error) => console.error(error),
            () => this.patchState({ LOADING: false }),
          ),
        ),
      ),
    );
  });

  public validateNewChat = this.effect((request$: Observable<string[]>) => {
    return request$.pipe(
      switchMap((ids) =>
        of(this.CHATS().find((x) => ids.includes(x.members[0].user_id))),
      ),
      withLatestFrom(request$),
      map(([chat, ids]) => {
        if (chat) {
          this.router.navigate(['/app/messaging/inbox/chat'], {
            queryParams: { chat_id: chat?.id },
          });
        } else {
          this.newChat(ids);
        }
      }),
    );
  });

  public readonly newChat = this.effect((request$: Observable<string[]>) =>
    request$.pipe(
      tap(() => this.patchState({ LOADING: true })),
      switchMap((request) =>
        from(this.supabase.client.rpc('new_chat', { user_ids: request })).pipe(
          map(({ error, data }) => {
            if (error) throw new Error();
            return data as string;
          }),
          tapResponse(
            (id) => {
              this.fetchChats();
              this.router.navigate(['/app/messaging/inbox/chat'], {
                queryParams: { chat_id: id },
              });
            },
            (error) => console.error(error),
            () => this.patchState({ LOADING: false }),
          ),
        ),
      ),
    ),
  );

  public ngrxOnStoreInit = (): void => {
    this.setState({ LOADING: false, CHATS: [], CHAT_ID: undefined });
    this.fetchChats();
  };
}
