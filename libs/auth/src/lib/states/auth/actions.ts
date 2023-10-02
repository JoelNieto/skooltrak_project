import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  SchoolUser,
  SignUpCredentials,
  User as Profile,
} from '@skooltrak/models';
import { Session, User } from '@supabase/supabase-js';

export const AuthActions = createActionGroup({
  source: 'Auth State API',
  events: {
    initState: emptyProps(),
    getSession: emptyProps(),
    setSession: props<{ session: Session | null }>(),
    updateProfile: props<{ request: Partial<Profile> }>(),
    getUser: emptyProps(),
    setUser: props<{ user: Profile }>(),
    getProfiles: emptyProps(),
    setProfiles: props<{ profiles: SchoolUser[] }>(),
    signUp: props<{ request: SignUpCredentials }>(),
    signUpSuccess: emptyProps(),
    signUpFailure: props<{ error: string }>(),
    signInEmail: props<{ email: string; password: string }>(),
    signInSuccess: props<{ user: User; session: Session }>(),
    signInFailure: props<{ error: unknown }>(),
    signOut: emptyProps(),
    setSchoolId: props<{ school_id: string | undefined }>(),
  },
});
