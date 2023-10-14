import { createFeature, createReducer, on } from '@ngrx/store';
import { SchoolUser, User } from '@skooltrak/models';
import { Session } from '@supabase/supabase-js';

import { AuthActions as actions } from './actions';

export type State = {
  LOADING: boolean;
  USER: User | undefined;
  SESSION: Session | null;
  PROFILES: SchoolUser[];
  SCHOOL_ID: string | undefined;
  ERROR: unknown | undefined;
};

export const initialState: State = {
  LOADING: false,
  PROFILES: [],
  USER: undefined,
  SESSION: null,
  SCHOOL_ID: undefined,
  ERROR: undefined,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(actions.initState, (state): State => ({ ...state, LOADING: true })),
    on(
      actions.setSession,
      (state, { SESSION }): State => ({ ...state, SESSION })
    ),
    on(
      actions.setUser,
      (state, { USER }): State => ({ ...state, USER, LOADING: false })
    ),
    on(
      actions.setSchoolId,
      (state, { SCHOOL_ID }): State => ({ ...state, SCHOOL_ID })
    ),
    on(
      actions.setProfiles,
      (state, { PROFILES }): State => ({ ...state, PROFILES })
    )
  ),
});
