import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Chat, Table } from '@skooltrak/models';
import { orderBy } from 'lodash';

import { SupabaseService } from '../../services/supabase.service';
import { AuthStore } from './auth.store';

type State = {
  loading: boolean;
  chats: Chat[];
  hasError: boolean;
  selectedId: string | undefined;
};

const initialState: State = {
  loading: false,
  chats: [],
  hasError: false,
  selectedId: undefined,
};

export const MessagesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ chats, selectedId }, auth = inject(AuthStore)) => ({
    userId: computed(() => auth.userId()),
    sortedChats: computed(() => orderBy(chats(), ['last_message'], ['desc'])),
    currentChat: computed(() => chats().find((x) => x.id === selectedId())),
  })),
  withMethods(
    (
      { chats, userId, ...state },
      supabase = inject(SupabaseService),
      router = inject(Router),
    ) => ({
      async fetchChats() {
        patchState(state, { loading: true, hasError: false });
        const { data, error } = await supabase.client
          .from(Table.Chats)
          .select('*, members:chat_members(user_id, user:users(*), created_at)')
          .neq('members.user_id', userId());

        if (error) {
          console.error(error);
          patchState(state, { loading: false, hasError: true });

          return;
        }

        patchState(state, { loading: false, chats: data });
      },
      async newChat(ids: string[]) {
        patchState(state, { loading: true });
        const existing = chats().find(
          (x) => x.members.length === 1 && ids.includes(x.members[0].user_id),
        );

        if (existing) {
          this.navigateToChat(existing.id);
          patchState(state, { loading: false });

          return;
        }

        const { data, error } = await supabase.client.rpc('new_chat', {
          user_ids: ids,
        });
        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        this.fetchChats();
        this.navigateToChat(data.id);
        patchState(state, { loading: false });
      },
      navigateToChat(id: string) {
        router.navigate(['/app/messaging/inbox/chat'], {
          queryParams: { chat_id: id },
        });
      },
    }),
  ),
);
