import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Link, SchoolRole, Table, User } from '@skooltrak/models';
import { sortBy } from 'lodash';
import {
  catchError,
  exhaustMap,
  from,
  iif,
  map,
  mergeMap,
  of,
  tap,
  throwError,
} from 'rxjs';

import { SupabaseService } from '../services/supabase.service';
import { AuthActions } from './actions';

export const initState = createEffect(
  () => {
    return inject(Actions).pipe(
      ofType(AuthActions.initState),
      map(() => AuthActions.getSession())
    );
  },
  { functional: true }
);

export const getSession = createEffect(
  (actions$ = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions$.pipe(
      ofType(AuthActions.getSession),
      exhaustMap(() =>
        supabase.session$.pipe(
          map((session) => AuthActions.setSession({ session }))
        )
      )
    );
  },
  { functional: true }
);

export const setSession = createEffect(
  (actions$ = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions$.pipe(
      ofType(AuthActions.setSession),
      mergeMap(({ session }) =>
        iif(
          () => !!session,
          of(session),
          throwError(() => new Error('test'))
        )
      ),
      tap((session) => console.log(session)),
      exhaustMap((session) =>
        from(
          supabase.client
            .from(Table.Users)
            .select(
              'id, email, full_name, avatar_url, updated_at, first_name, middle_name, father_name, mother_name, birth_date, gender'
            )
            .eq('id', session?.user.id)
            .single()
        ).pipe(
          map(({ error, data }) => {
            if (error) throw new Error(error.message);
            return data;
          })
        )
      ),
      map((user) => AuthActions.setUser({ user })),
      catchError((error) => of(AuthActions.sessionFailed(error)))
    );
  },
  { functional: true }
);

export const updateUser = createEffect(
  (actions$ = inject(Actions), supabase = inject(SupabaseService)) => {
    return actions$.pipe(
      ofType(AuthActions.updateProfile),
      exhaustMap(({ request }) =>
        from(
          supabase.client
            .from(Table.Users)
            .update([request])
            .eq('id', request.id)
            .select('*')
        ).pipe(
          map(({ data, error }) => {
            if (error) throw new Error(error.message);
            return data as unknown as User;
          })
        )
      ),
      map((user) => AuthActions.setUser({ user }))
    );
  },
  { functional: true }
);

export const setUser = createEffect(
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

export const setRoles = createEffect(
  () => {
    return inject(Actions).pipe(
      ofType(AuthActions.setRoles),
      map(({ roles }) => AuthActions.setRole({ role: roles[0] }))
    );
  },
  { functional: true }
);

export const setRole = createEffect(
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
            return sortBy(
              data.map((x) => x.link && x.link) as unknown as Link[],
              'sort'
            );
          })
        )
      ),
      map((links) => AuthActions.setLinks({ links }))
    );
  },
  { functional: true }
);

export const signIn = createEffect(
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
