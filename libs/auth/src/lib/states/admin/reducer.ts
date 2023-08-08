import { createFeature, createReducer, on } from '@ngrx/store';
import { Link, School } from '@skooltrak/models';

import { AdminActions } from './actions';

export type State = {
  loading: boolean;
  schools: Partial<School>[];
  currentSchool: Partial<School> | undefined;
  links: Link[];
};

export const initialState: State = {
  loading: false,
  schools: [],
  links: [],
  currentSchool: undefined,
};

export const adminFeature = createFeature({
  name: 'admin',
  reducer: createReducer(
    initialState,
    on(AdminActions.initState, (state): State => ({ ...state, loading: true }))
  ),
});
