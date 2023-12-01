import { createFeature, createReducer, on } from '@ngrx/store';
import { SchoolUser, User } from '@skooltrak/models';
import { Session } from '@supabase/supabase-js';

import { MobileAuthActions as actions } from './actions';

export type State = {
  loading: boolean;
  user: User | undefined;
  session: Session | null;
  profiles: SchoolUser[];
  schoolId: string | undefined;
  error: unknown | undefined;
};

const initialState: State = {
  loading: false,
  profiles: [],
  user: undefined,
  session: null,
  schoolId: undefined,
  error: undefined,
};

export const mobileAuthFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(actions.initState, (state): State => ({ ...state, loading: true })),
    on(
      actions.setSession,
      (state, { session }): State => ({ ...state, session }),
    ),
    on(
      actions.setUser,
      (state, { user }): State => ({ ...state, user, loading: false }),
    ),
    on(
      actions.setSchoolId,
      (state, { schoolId }): State => ({ ...state, schoolId }),
    ),
    on(
      actions.setProfiles,
      (state, { profiles }): State => ({ ...state, profiles }),
    ),
    on(actions.signInFailure, (state): State => ({ ...state, loading: false })),
    on(actions.signOut, (state): State => ({ ...state, ...initialState })),
  ),
});
