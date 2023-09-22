import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from '@skooltrak/models';

import { AuthActions } from './actions';
import * as selectors from './selectors';

@Injectable({ providedIn: 'root' })
export class AuthStateFacade {
  private store$ = inject(Store);

  public user = this.store$.selectSignal(selectors.selectUser);
  public loading = this.store$.selectSignal(selectors.selectLoading);
  public session = this.store$.selectSignal(selectors.selectSession);
  public roles = this.store$.selectSignal(selectors.selectRoles);
  public currentRole = this.store$.selectSignal(selectors.selectCurrentRole);
  public currentSchoolId = this.store$.selectSignal(selectors.selectSchoolId);
  public schools = this.store$.selectSignal(selectors.selectSchools);

  public init() {
    this.store$.dispatch(AuthActions.initState());
  }

  public signIn(email: string, password: string) {
    this.store$.dispatch(AuthActions.signInEmail({ email, password }));
  }

  public updateProfile(request: Partial<User>) {
    this.store$.dispatch(AuthActions.updateProfile({ request }));
  }
}
