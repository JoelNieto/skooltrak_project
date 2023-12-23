import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { MobileAuthActions as actions } from './actions';
import * as selectors from './selectors';

@Injectable({ providedIn: 'root' })
export class MobileAuthFacade {
  private readonly store = inject(Store);

  public USER = this.store.selectSignal(selectors.selectUser);
  public USER_ID = this.store.selectSignal(selectors.selectUserId);
  public LOADING = this.store.selectSignal(selectors.selectLoading);
  public CURRENT_SCHOOL = this.store.selectSignal(selectors.selectSchool);
  public ROLES = this.store.selectSignal(selectors.selectRoles);
  public IS_ADMIN = this.store.selectSignal(selectors.selectIsAdmin);
  public IS_TEACHER = this.store.selectSignal(selectors.selectIsTeacher);
  public IS_STUDENT = this.store.selectSignal(selectors.selectIsStudent);
  public SCHOOLS = this.store.selectSignal(selectors.selectSchools);
  public SCHOOL = this.store.selectSignal(selectors.selectSchool);
  public SESSION = this.store.selectSignal(selectors.selectSession);
  public CURRENT_SCHOOL_ID = this.store.selectSignal(selectors.selectSchoolId);
  public init(): void {
    this.store.dispatch(actions.initState());
  }

  public signIn(email: string, password: string): void {
    this.store.dispatch(actions.signInEmail({ email, password }));
  }

  public signOut(): void {
    this.store.dispatch(actions.signOut());
  }

  public setSchoolId(schoolId: string): void {
    this.store.dispatch(actions.setSchoolId({ schoolId }));
  }
}
