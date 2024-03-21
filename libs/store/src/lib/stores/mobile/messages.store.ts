import { computed, inject } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Chat, Table } from '@skooltrak/models';
import { SupabaseService, mobileStore } from '@skooltrak/store';
import { orderBy } from 'lodash';

type State = {
  chats: Chat[];
  selectedId: string | undefined;
  queryText: string;
  loading: boolean;
};

export const MessagesStore = signalStore(
  { providedIn: 'root' },
  withState({
    chats: [],
    selectedId: undefined,
    queryText: '',
    filteredChats: [],
    loading: false,
  } as State),
  withComputed(
    ({ chats, selectedId }, auth = inject(mobileStore.AuthStore)) => ({
      userId: computed(() => auth.userId()),
      sortedChats: computed(() => orderBy(chats(), ['last_message'], ['desc'])),
      selectedChat: computed(() => chats().find((x) => x.id === selectedId())),
    }),
  ),
  withMethods(
    (
      { chats, ...state },
      supabase = inject(SupabaseService),
      loadingCtrl = inject(LoadingController),
      navCtrl = inject(NavController),
    ) => ({
      async fetchChats(): Promise<void> {
        patchState(state, { loading: true });
        const { data, error } = await supabase.client
          .from(Table.Chats)
          .select(
            '*, members:chat_members(user_id, user:users(*), created_at), message:messages!inner(id, text, sent_at)',
          )
          .order('last_message', { ascending: false })
          .order('sent_at', { referencedTable: 'messages', ascending: false })
          .limit(1, { foreignTable: 'messages' });
        if (error) {
          console.error(error);
          patchState(state, { loading: false });

          return;
        }

        patchState(state, { chats: data, loading: false });
      },

      async newChat(ids: string[]): Promise<void> {
        const loading = await loadingCtrl.create();
        await loading.present();
        const chat = chats().find(
          (x) => x.members.length === 1 && ids.includes(x.members[0].user_id),
        );
        if (chat) {
          loading.dismiss();
          this.navigateToChat(chat.id);

          return;
        }

        const { data, error } = await supabase.client.rpc('new_chat', {
          user_ids: ids,
        });

        if (error) {
          console.error();
          loading.dismiss();

          return;
        }
        this.fetchChats();
        this.navigateToChat(data);
        loading.dismiss();
      },

      navigateToChat(chatId: string): void {
        navCtrl.navigateForward(['tabs/messages/chat'], {
          queryParams: { chat_id: chatId },
        });
      },
    }),
  ),
);
