import { createFeature, createReducer, on } from '@ngrx/store';
import { Link, School } from '@skooltrak/models';

import { AdminActions } from './actions';

export type State = {
  loading: boolean;
  schools: Partial<School>[];
  CURRENT_SCHOOL: Partial<School> | undefined;
  links: Link[];
};

export const initialState: State = {
  loading: false,
  schools: [],
  links: [],
  CURRENT_SCHOOL: undefined,
};

export const adminFeature = createFeature({
  name: 'admin',
  reducer: createReducer(
    initialState,
    on(AdminActions.initState, (state): State => ({ ...state, loading: true }))
  ),
});
