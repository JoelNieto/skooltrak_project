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
    setSession: props<{ SESSION: Session | null }>(),
    updateProfile: props<{ REQUEST: Partial<Profile> }>(),
    getUser: emptyProps(),
    setUser: props<{ USER: Profile }>(),
    getProfiles: emptyProps(),
    setProfiles: props<{ PROFILES: SchoolUser[] }>(),
    signUp: props<{ REQUEST: SignUpCredentials }>(),
    signUpSuccess: emptyProps(),
    signUpFailure: props<{ ERROR: string }>(),
    signInEmail: props<{ EMAIL: string; PASSWORD: string }>(),
    signInSuccess: props<{ USER: User; SESSION: Session }>(),
    signInFailure: props<{ ERROR: 'SIGN_IN' | 'OTHER' }>(),
    signOut: emptyProps(),
    setSchoolId: props<{ SCHOOL_ID: string | undefined }>(),
  },
});
