import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { School } from '@skooltrak/models';

export const AdminActions = createActionGroup({
  source: 'Admin State API',
  events: {
    initState: emptyProps(),
    getSchools: props<{ schools: Partial<School>[] }>(),
    setSchool: props<{ school: Partial<School> }>(),
  },
});
