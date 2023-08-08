import { createFeatureSelector, createSelector } from '@ngrx/store';

import { authFeature, State } from './reducer';

export const selectAuthState = createFeatureSelector<State>(authFeature.name);

export const selectSession = createSelector(
  selectAuthState,
  (state: State) => state.session
);

export const selectLoading = createSelector(
  selectAuthState,
  (state: State) => state.loading
);

export const selectUser = createSelector(
  selectAuthState,
  (state: State) => state.user
);

export const selectRoles = createSelector(
  selectAuthState,
  (state: State) => state.roles
);

export const selectCurrentRole = createSelector(
  selectAuthState,
  (state: State) => state.currentRole
);

export const selectSchoolId = createSelector(
  selectCurrentRole,
  (state) => state?.school_id
);
