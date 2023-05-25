import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Link, SchoolRole, User } from '@skooltrak/models';
import { Session } from '@supabase/supabase-js';

export const AuthActions = createActionGroup({
  source: 'Auth API',
  events: {
    initState: emptyProps(),
    getSession: emptyProps(),
    setSession: props<{ session: Session | null }>(),
    setUser: props<{ user: User }>(),
    signIn: props<{ email: string; password: string }>(),
    setRoles: props<{ roles: SchoolRole[] }>(),
    signInSuccess: props<{ user: User }>(),
    signInFailure: props<{ error: any }>(),
    setRole: props<{ role: SchoolRole | undefined }>(),
    setLinks: props<{ links: Link[] }>(),
  },
});
