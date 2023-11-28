import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Chat } from '@skooltrak/models';

export const MessageActions = createActionGroup({
  source: 'Messaging State API',
  events: {
    getChats: emptyProps(),
    setChats: props<{ chats: Chat[] }>(),
    newChat: props<{ ids: string[] }>(),
    newChatSuccess: props<{ id: string }>(),
    setCurrentChat: props<{ id: string }>(),
  },
});
