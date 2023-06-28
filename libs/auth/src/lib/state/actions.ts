import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Link, SchoolRole, User } from '@skooltrak/models';
import { Session } from '@supabase/supabase-js';

export const AuthActions = createActionGroup({
  source: 'Auth API',
  events: {
    initState: emptyProps(),
    getSession: emptyProps(),
    updateProfile: props<{ request: Partial<User> }>(),
    sessionFailed: props<{ error: string }>(),
    setSession: props<{ session: Session | null }>(),
    updateUser: props<{ user: User }>(),
    setUser: props<{ user: User }>(),
    signIn: props<{ email: string; password: string }>(),
    setRoles: props<{ roles: SchoolRole[] }>(),
    signInSuccess: props<{ user: User }>(),
    signInFailure: props<{ error: string | unknown }>(),
    setRole: props<{ role: SchoolRole | undefined }>(),
    setLinks: props<{ links: Link[] }>(),
  },
});
