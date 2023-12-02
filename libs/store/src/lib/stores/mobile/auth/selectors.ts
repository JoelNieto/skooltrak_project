import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RoleEnum, School, SchoolUser } from '@skooltrak/models';

import { mobileAuthFeature, State } from './reducer';

export const selectAuthState = createFeatureSelector<State>(
  mobileAuthFeature.name,
);

export const selectSession = createSelector(
  selectAuthState,
  (state) => state.session,
);

export const selectLoading = createSelector(
  selectAuthState,
  (state) => state.loading,
);

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user,
);

export const selectUserId = createSelector(selectUser, (state) => state?.id);

export const selectSchoolId = createSelector(
  selectAuthState,
  (state) => state.schoolId,
);

export const selectProfiles = createSelector(
  selectAuthState,
  (state) => state.profiles,
);

export const selectSchools = createSelector(selectProfiles, (state) => [
  ...new Set(state.map((x) => x.school)),
]);

export const selectSchool = createSelector(
  selectSchools,
  selectSchoolId,
  (schools: Partial<School>[], id: string | undefined) =>
    schools.find((x) => x.id === id),
);

export const selectRoles = createSelector(
  selectProfiles,
  selectSchoolId,
  (profiles: SchoolUser[], id: string | undefined) =>
    profiles.filter((x) => x.school_id === id).map((x) => x.role),
);

export const selectIsAdmin = createSelector(selectRoles, (roles) =>
  roles.includes(RoleEnum.Administrator),
);
export const selectIsTeacher = createSelector(selectRoles, (roles) =>
  roles.includes(RoleEnum.Teacher),
);
export const selectIsStudent = createSelector(selectRoles, (roles) =>
  roles.includes(RoleEnum.Student),
);
