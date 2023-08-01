import { Component, effect, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { state } from '@skooltrak/auth';
import { RoleEnum } from '@skooltrak/models';
import { DashboardComponent } from '@skooltrak/ui';

@Component({
  selector: 'sk-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, DashboardComponent, TranslateModule],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  store$ = inject(Store);
  router = inject(Router);
  translate = inject(TranslateService);
  currentRole = this.store$.selectSignal(state.selectors.selectCurrentRole);
  loading = this.store$.selectSignal(state.selectors.selectLoading);
  constructor() {
    effect(() => {
      if (this.loading()) {
        return;
      }
      if (!this.currentRole()) {
        this.router.initialNavigation();
        return;
      }
      const { role } = this.currentRole() || {};

      if (role?.code === RoleEnum.Administrator) {
        this.router.resetConfig([
          {
            path: 'app',
            loadComponent: () =>
              import('@skooltrak/ui').then((x) => x.DashboardComponent),
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('admin/Routes').then((m) => m.remoteRoutes),
              },
            ],
          },
          { path: '', redirectTo: 'app', pathMatch: 'full' },
        ]);
        this.router.initialNavigation();
      }
    });
  }

  ngOnInit(): void {
    this.translate.setDefaultLang('es');
    this.store$.dispatch(state.AuthActions.initState());
  }
}
