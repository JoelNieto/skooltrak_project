import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withState } from '@ngrx/signals';

import { CourseDetailsStore } from '../details/course-details.store';

type State = {
  loading: boolean;
  groupId: string | undefined;
};

const initialState: State = { loading: false, groupId: undefined };

export const CourseStudentsStore = signalStore(
  { protectedState: false }, withState(initialState),
  withComputed((state, course = inject(CourseDetailsStore)) => ({
    students: computed(() =>
      course
        .students()
        .filter((x) =>
          state.groupId() ? x.profile[0].group?.id === state.groupId() : true,
        ),
    ),
  })),
);
