import { createFeature, createReducer, on } from '@ngrx/store';
import { SchoolUser, User } from '@skooltrak/models';
import { Session } from '@supabase/supabase-js';

import { AuthActions as actions } from './actions';

export type State = {
  loading: boolean;
  user: User | undefined;
  session: Session | null;
  profiles: SchoolUser[];
  school_id: string | undefined;
  error: unknown | undefined;
};

export const initialState: State = {
  loading: false,
  profiles: [],
  user: undefined,
  session: null,
  school_id: undefined,
  error: undefined,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(actions.initState, (state): State => ({ ...state, loading: true })),
    on(
      actions.setSession,
      (state, { session }): State => ({ ...state, session })
    ),
    on(
      actions.setUser,
      (state, { user }): State => ({ ...state, user, loading: false })
    ),
    on(
      actions.setSchoolId,
      (state, { school_id }): State => ({ ...state, school_id })
    ),
    on(
      actions.setProfiles,
      (state, { profiles }): State => ({ ...state, profiles })
    )
  ),
});
