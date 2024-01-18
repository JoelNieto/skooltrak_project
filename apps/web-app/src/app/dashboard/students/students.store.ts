import { signalStore, withState } from '@ngrx/signals';
import { ClassGroup } from '@skooltrak/models';

type State = {
  loading: boolean;
  groups: Partial<ClassGroup>[];
};

const initialState: State = { loading: false, groups: [] };

export const CourseStudentsStore = signalStore(withState(initialState));
