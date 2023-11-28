import { createFeatureSelector, createSelector } from '@ngrx/store';

import { messageFeature, State } from './reducer';

export const selectMessagingState = createFeatureSelector<State>(
  messageFeature.name,
);

export const selectChats = createSelector(
  selectMessagingState,
  (state) => state.chats,
);

export const selectLoading = createSelector(
  selectMessagingState,
  (state) => state.loading,
);

export const selectCurrentId = createSelector(
  selectMessagingState,
  (state) => state.selectedId,
);

export const selectCurrentChat = createSelector(selectMessagingState, (state) =>
  state.chats.find((x) => x.id === state.selectedId),
);
