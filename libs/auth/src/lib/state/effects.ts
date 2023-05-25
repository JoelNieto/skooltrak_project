import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Link, SchoolRole } from '@skooltrak/models';
import { sortBy } from 'lodash';
import { catchError, exhaustMap, filter, from, map, of } from 'rxjs';

import { SupabaseService } from '../services/supabase.service';
import { AuthActions } from './actions';

export const initState$ = createEffect(
  () => {
    return inject(Actions).pipe(
      ofType(AuthActions.initState),
      map(() => AuthActions.getSession())
    );
  },
  { functional: true }
);

export const getSession$ = createEffect(
  (actions$ = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions$.pipe(
      ofType(AuthActions.getSession),
      exhaustMap(() =>
        supabase.session.pipe(
          filter((session) => !!session),
          map((session) => AuthActions.setSession({ session }))
        )
      )
    );
  },
  { functional: true }
);

export const setSession$ = createEffect(
  (actions$ = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions$.pipe(
      ofType(AuthActions.setSession),
      exhaustMap(({ session }) =>
        from(
          supabase.client
            .from('users')
            .select('id, email, full_name, avatar_url, updated_at')
            .eq('id', session?.user.id)
            .single()
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          })
        )
      ),
      map((user) => AuthActions.setUser({ user }))
    );
  },
  { functional: true }
);

export const setUser$ = createEffect(
  (actions$ = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions$.pipe(
      ofType(AuthActions.setUser),
      exhaustMap(({ user }) =>
        from(
          supabase.client
            .from('school_users')
            .select('id,school:schools(*), role:roles(id, code, name)')
            .eq('user_id', user.id)
        ).pipe(
          map(({ data, error }) => {
            if (error) throw new Error(error.message);
            return data as SchoolRole[];
          })
        )
      ),
      map((roles) => AuthActions.setRoles({ roles }))
    );
  },
  { functional: true }
);

export const setRoles$ = createEffect(
  () => {
    return inject(Actions).pipe(
      ofType(AuthActions.setRoles),
      map(({ roles }) => AuthActions.setRole({ role: roles[0] }))
    );
  },
  { functional: true }
);

export const setRole$ = createEffect(
  (actions$ = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions$.pipe(
      ofType(AuthActions.setRole),
      exhaustMap(({ role }) =>
        from(
          supabase.client
            .from('role_links')
            .select('link:links(route, name, icon, sort)')
            .eq('role_id', role?.role?.id)
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return sortBy(data.map((x) => x.link && x.link) as Link[], 'sort');
          })
        )
      ),
      map((links) => AuthActions.setLinks({ links }))
    );
  },
  { functional: true }
);

export const signIn$ = createEffect(
  (actions$ = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions$.pipe(
      ofType(AuthActions.signIn),
      exhaustMap(({ email, password }) =>
        from(supabase.signInWithEmail(email, password)).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          })
        )
      ),
      map(({ session }) => AuthActions.setSession({ session })),
      catchError((error) => of(AuthActions.signInFailure({ error })))
    );
  },
  { functional: true }
);
