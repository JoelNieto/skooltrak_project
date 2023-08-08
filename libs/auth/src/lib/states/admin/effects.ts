import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AdminActions } from './actions';

export const initState = createEffect(
  () => {
    return inject(Actions).pipe(ofType(AdminActions.initState));
  },
  { functional: true }
);
