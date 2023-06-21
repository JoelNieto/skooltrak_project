import { createFeature, createReducer, on } from '@ngrx/store';
import { Link, SchoolRole, User } from '@skooltrak/models';
import { Session } from '@supabase/supabase-js';

import { AuthActions as actions } from './actions';

export type State = {
  loading: boolean;
  user: User | undefined;
  session: Session | null;
  roles: SchoolRole[];
  currentRole: SchoolRole | undefined;
  links: Link[];
  error: unknown | undefined;
};

export const initialState: State = {
  loading: true,
  roles: [],
  user: undefined,
  session: null,
  links: [],
  currentRole: undefined,
  error: undefined,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(
      actions.initState,
      (state): State => ({
        ...state,
      })
    ),
    on(
      actions.setSession,
      (state, { session }): State => ({ ...state, session })
    ),
    on(
      actions.sessionFailed,
      (state, { error }): State => ({
        ...state,
        error,
        loading: false,
      })
    ),
    on(actions.setUser, (state, { user }): State => ({ ...state, user })),
    on(
      actions.setRoles,
      (state, { roles }): State => ({
        ...state,
        roles,
      })
    ),
    on(
      actions.setRole,
      (state, { role }): State => ({
        ...state,
        currentRole: role,
      })
    ),
    on(
      actions.setLinks,
      (state, { links }): State => ({
        ...state,
        links,
        loading: false,
      })
    )
  ),
});
