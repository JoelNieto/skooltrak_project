import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User as Profile, UserRole } from '@skooltrak/models';
import { Session, User } from '@supabase/supabase-js';

export const AuthActions = createActionGroup({
  source: 'Auth State API',
  events: {
    initState: emptyProps(),
    getSession: emptyProps(),
    setSession: props<{ session: Session | null }>(),
    updateProfile: props<{ request: Partial<Profile> }>(),
    setUser: props<{ user: Profile }>(),
    setRoles: props<{ roles: UserRole[] }>(),
    setCurrentRole: props<{ role: UserRole }>(),
    signInEmail: props<{ email: string; password: string }>(),
    signInSuccess: props<{ user: User; session: Session }>(),
    signInFailure: props<{ error: unknown }>(),
    signOut: emptyProps(),
  },
});
