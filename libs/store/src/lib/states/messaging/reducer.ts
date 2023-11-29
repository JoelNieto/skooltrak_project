import { createFeature, createReducer, on } from '@ngrx/store';
import { Chat } from '@skooltrak/models';

import { MessageActions as actions } from './actions';

export type State = {
  loading: boolean;
  chats: Chat[];
  error: unknown | undefined;
  selectedId: string | undefined;
};

const initialState: State = {
  loading: false,
  chats: [],
  error: undefined,
  selectedId: undefined,
};

export const messageFeature = createFeature({
  name: 'messaging',
  reducer: createReducer(
    initialState,
    on(actions.getChats, (state): State => ({ ...state, loading: true })),
    on(
      actions.setChats,
      (state, { chats }): State => ({ ...state, chats, loading: false }),
    ),
    on(
      actions.setCurrentChat,
      (state, { id }): State => ({ ...state, selectedId: id }),
    ),
  ),
});
