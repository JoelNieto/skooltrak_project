import { createFeature, createReducer, on } from '@ngrx/store';
import { School, User, UserRole } from '@skooltrak/models';
import { Session } from '@supabase/supabase-js';

import { AuthActions as actions } from './actions';

export type State = {
  loading: boolean;
  user: User | undefined;
  session: Session | null;
  roles: UserRole[];
  currentRole: UserRole | undefined;
  schools: Partial<School>[];
  school_id: string | undefined;
  error: unknown | undefined;
};

export const initialState: State = {
  loading: false,
  roles: [],
  user: undefined,
  session: null,
  schools: [],
  school_id: undefined,
  currentRole: undefined,
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
    on(actions.setRoles, (state, { roles }): State => ({ ...state, roles })),
    on(
      actions.setSchools,
      (state, { schools }): State => ({ ...state, schools })
    ),
    on(
      actions.setSchoolId,
      (state, { school_id }): State => ({ ...state, school_id })
    )
  ),
});
