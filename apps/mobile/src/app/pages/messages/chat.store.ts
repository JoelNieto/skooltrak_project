import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Message, Table } from '@skooltrak/models';
import { mobileStore, SupabaseService } from '@skooltrak/store';
import { filter, from, map, pipe, switchMap, tap } from 'rxjs';

type State = {
  messages: Message[];
  chatId: string;
  loading: boolean;
};

export const ChatStore = signalStore(
  { protectedState: false }, withState({ loading: false, messages: [], chatId: '' } as State),
  withComputed(
    (
      { chatId },
      auth = inject(mobileStore.AuthStore),
      message = inject(mobileStore.MessagesStore),
    ) => ({
      userId: computed(() => auth.userId()),
      currentChat: computed(() =>
        message.chats().find((x) => x.id === chatId()),
      ),
    }),
  ),
  withMethods(
    (
      { chatId, userId, messages, ...state },
      supabase = inject(SupabaseService),
    ) => ({
      fetchMessages: rxMethod<string>(
        pipe(
          filter(() => !!chatId()),
          tap(() => patchState(state, { loading: true })),
          switchMap(() =>
            from(
              supabase.client
                .from(Table.Messages)
                .select('id, user_id, text, user:users(*), sent_at')
                .order('sent_at', { ascending: false })
                .eq('chat_id', chatId()),
            ).pipe(
              map(({ error, data }) => {
                if (error) throw new Error(error.message);
                return data.map((x) => ({
                  ...x,
                  mine: x.user_id === userId(),
                })) as Message[];
              }),
              tapResponse({
                next: (messages) => patchState(state, { messages }),
                error: (error) => console.error(error),
                finalize: () => patchState(state, { loading: false }),
              }),
            ),
          ),
        ),
      ),
      async sendMessage(text: string): Promise<void> {
        const { error, data } = await supabase.client
          .from(Table.Messages)
          .insert([{ chat_id: chatId(), text }])
          .select('id, user_id, text, user:users(*), sent_at')
          .single();

        if (error) {
          console.error(error);
          return;
        }

        patchState(state, {
          messages: [{ mine: true, ...(data as Message) }, ...messages()],
        });
      },
    }),
  ),
  withHooks({
    onInit({ fetchMessages, chatId }) {
      fetchMessages(chatId);
    },
  }),
);
