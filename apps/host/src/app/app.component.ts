import { Component, effect, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';
import { RoleTypeEnum } from '@skooltrak/models';
import { DashboardComponent } from '@skooltrak/ui';

@Component({
  selector: 'sk-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, DashboardComponent, TranslateModule],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  store$ = inject(Store);
  auth = inject(authState.AuthStateFacade);
  router = inject(Router);
  translate = inject(TranslateService);
  currentRole = this.auth.currentRole;
  user = this.auth.user;
  loading = this.auth.loading;
  constructor() {
    effect(() => {
      if (this.loading()) {
        return;
      }
      if (!this.user()) {
        this.router.initialNavigation();
        return;
      }

      if (this.currentRole()?.role === RoleTypeEnum.Administrator) {
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
    this.auth.init();
  }
}
