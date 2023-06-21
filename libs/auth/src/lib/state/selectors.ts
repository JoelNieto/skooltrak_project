import { createFeatureSelector, createSelector } from '@ngrx/store';

import { authFeature, State } from './reducer';

export const selectAuthState = createFeatureSelector<State>(authFeature.name);

export const selectSession = createSelector(
  selectAuthState,
  (state: State) => state?.session
);
export const selectLoading = createSelector(
  selectAuthState,
  (state: State) => state?.loading
);

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);
export const selectLinks = createSelector(
  selectAuthState,
  (state) => state.links
);
export const selectRoles = createSelector(
  selectAuthState,
  (state) => state.roles
);
export const selectCurrentRole = createSelector(
  selectAuthState,
  (state) => state.currentRole
);
export const selectCurrentSchool = createSelector(
  selectCurrentRole,
  (state) => state?.school
);

/* export const selectCurrentRole = createSelector(
  selectRoles, selectCurrentRoleId, (roles, current) => roles.find(x => x.role.)
) */
