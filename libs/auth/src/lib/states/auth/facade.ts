import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SignUpCredentials, User } from '@skooltrak/models';

import { AuthActions } from './actions';
import * as selectors from './selectors';

@Injectable({ providedIn: 'root' })
export class AuthStateFacade {
  private store = inject(Store);

  public USER = this.store.selectSignal(selectors.selectUser);
  public LOADING = this.store.selectSignal(selectors.selectLoading);
  public SESSION = this.store.selectSignal(selectors.selectSession);
  public CURRENT_SCHOOL_ID = this.store.selectSignal(selectors.selectSchoolId);
  public CURRENT_SCHOOL_ID$ = this.store.select(selectors.selectSchoolId);
  public SCHOOLS = this.store.selectSignal(selectors.selectSchools);
  public CURRENT_SCHOOL = this.store.selectSignal(selectors.selectSchool);
  public ROLES = this.store.selectSignal(selectors.selectRoles);
  public IS_ADMIN = this.store.selectSignal(selectors.selectIsAdmin);
  public IS_TEACHER = this.store.selectSignal(selectors.selectIsTeacher);
  public IS_STUDENT = this.store.selectSignal(selectors.selectIsStudent);

  public init() {
    this.store.dispatch(AuthActions.initState());
  }

  public signIn(email: string, password: string): void {
    this.store.dispatch(
      AuthActions.signInEmail({ EMAIL: email, PASSWORD: password }),
    );
  }

  public signOut(): void {
    this.store.dispatch(AuthActions.signOut());
  }

  public signUp(request: SignUpCredentials): void {
    this.store.dispatch(AuthActions.signUp({ REQUEST: request }));
  }

  public updateProfile(request: Partial<User>): void {
    this.store.dispatch(AuthActions.updateProfile({ REQUEST: request }));
  }

  public getProfiles(): void {
    this.store.dispatch(AuthActions.getProfiles());
  }

  public setSchoolId(school_id: string): void {
    this.store.dispatch(AuthActions.setSchoolId({ SCHOOL_ID: school_id }));
  }
}
