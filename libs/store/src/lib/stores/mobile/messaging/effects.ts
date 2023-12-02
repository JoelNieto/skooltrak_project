import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Table } from '@skooltrak/models';
import { from, iif, map, of, switchMap, tap } from 'rxjs';

import { SupabaseService } from '../../../services/supabase.service';
import { MobileAuthFacade } from '../auth';
import { MessageActions } from './actions';
import { MessagingStateFacade } from './facade';

export const getChats = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    auth = inject(MobileAuthFacade),
  ) => {
    return actions.pipe(
      ofType(MessageActions.getChats),
      switchMap(() =>
        from(
          supabase.client
            .from(Table.Chats)
            .select(
              '*, members:chat_members(user_id, user:users(*), created_at)',
            )
            .neq('members.user_id', auth.USER_ID())
            .order('last_message', { ascending: false }),
        ).pipe(
          map(({ data, error }) => {
            if (error) throw new Error(error.message);
            return data;
          }),
          map((chats) => MessageActions.setChats({ chats })),
        ),
      ),
    );
  },
  { functional: true },
);

export const newChat = createEffect(
  (
    actions = inject(Actions),
    supabase = inject(SupabaseService),
    state = inject(MessagingStateFacade),
  ) => {
    return actions.pipe(
      ofType(MessageActions.newChat),
      map(({ ids }) => ({
        ids,
        chat: state
          .CHATS()
          .find(
            (x) => x.members.length === 1 && ids.includes(x.members[0].user_id),
          ),
      })),
      switchMap(({ ids, chat }) => {
        return iif(
          () => !!chat,
          of(MessageActions.newChatSuccess({ id: chat?.id ?? '' })),
          from(supabase.client.rpc('new_chat', { user_ids: ids })).pipe(
            map(({ error, data }) => {
              if (error) throw new Error();
              return data as string;
            }),
            tap(() => state.getMessages()),
            map((id) => MessageActions.newChatSuccess({ id })),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const newChatSuccess = createEffect(
  (
    actions = inject(Actions),

    router = inject(Router),
  ) => {
    return actions.pipe(
      ofType(MessageActions.newChatSuccess),

      map(({ id }) =>
        router.navigate(['/app/messaging/inbox/chat'], {
          queryParams: { chat_id: id },
        }),
      ),
    );
  },
  { functional: true, dispatch: false },
);
