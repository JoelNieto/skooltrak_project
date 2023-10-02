import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SignUpCredentials, User } from '@skooltrak/models';

import { AuthActions } from './actions';
import * as selectors from './selectors';

@Injectable({ providedIn: 'root' })
export class AuthStateFacade {
  private store$ = inject(Store);

  public user = this.store$.selectSignal(selectors.selectUser);
  public loading = this.store$.selectSignal(selectors.selectLoading);
  public session = this.store$.selectSignal(selectors.selectSession);
  public currentSchoolId = this.store$.selectSignal(selectors.selectSchoolId);
  public schools = this.store$.selectSignal(selectors.selectSchools);
  public currentSchool = this.store$.selectSignal(selectors.selectSchool);
  public roles = this.store$.selectSignal(selectors.selectRoles);
  public isAdmin = this.store$.selectSignal(selectors.selectIsAdmin);
  public isTeacher = this.store$.selectSignal(selectors.selectIsTeacher);
  public isStudent = this.store$.selectSignal(selectors.selectIsStudent);

  public init() {
    this.store$.dispatch(AuthActions.initState());
  }

  public signIn(email: string, password: string): void {
    this.store$.dispatch(AuthActions.signInEmail({ email, password }));
  }

  public signUp(request: SignUpCredentials): void {
    this.store$.dispatch(AuthActions.signUp({ request }));
  }

  public updateProfile(request: Partial<User>): void {
    this.store$.dispatch(AuthActions.updateProfile({ request }));
  }

  public getProfiles(): void {
    this.store$.dispatch(AuthActions.getProfiles());
  }

  public setSchoolId(school_id: string): void {
    this.store$.dispatch(AuthActions.setSchoolId({ school_id }));
  }
}
