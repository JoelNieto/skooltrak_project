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
  error: any | undefined;
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
    on(actions.initState, (state) => ({
      ...state,
    })),
    on(actions.setSession, (state, { session }) => ({ ...state, session })),
    on(actions.sessionFailed, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),
    on(actions.setUser, (state, { user }) => ({ ...state, user })),
    on(actions.setRoles, (state, { roles }) => ({
      ...state,
      roles,
    })),
    on(actions.setRole, (state, { role }) => ({
      ...state,
      currentRole: role,
    })),
    on(actions.setLinks, (state, { links }) => ({
      ...state,
      links,
      loading: false,
    }))
  ),
});
