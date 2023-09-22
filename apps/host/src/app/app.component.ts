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
  private store$ = inject(Store);
  private auth = inject(authState.AuthStateFacade);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private currentRole = this.auth.currentRole;
  private user = this.auth.user;
  private loading = this.auth.loading;
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

  async ngOnInit(): Promise<void> {
    this.translate.setDefaultLang('es');
    this.auth.init();
  }
}
