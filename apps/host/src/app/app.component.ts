import { Component, effect, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { state } from '@skooltrak/auth';
import { RoleEnum } from '@skooltrak/models';
import { DashboardComponent } from '@skooltrak/ui';

@Component({
  selector: 'skooltrak-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, DashboardComponent, TranslateModule],
  template: ` <router-outlet /> `,
  styles: [``],
})
export class AppComponent implements OnInit {
  store = inject(Store);
  router = inject(Router);
  translate = inject(TranslateService);
  currentRole = this.store.selectSignal(state.selectors.selectCurrentRole);
  constructor() {
    effect(() => {
      if (!this.currentRole()) {
        return;
      }
      const { role } = this.currentRole()!;

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
                  import('admin/Module').then((m) => m.RemoteEntryModule),
              },
            ],
          },
          { path: '', redirectTo: 'app', pathMatch: 'full' },
        ]);
        this.router.navigate(['']);
      }
    });
  }

  ngOnInit(): void {
    this.translate.setDefaultLang('es');
    this.store.dispatch(state.AuthActions.initState());
  }
}
