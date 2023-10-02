import { Component, effect, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';

@Component({
  selector: 'sk-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, TranslateModule],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  private store$ = inject(Store);
  private auth = inject(authState.AuthStateFacade);
  private router = inject(Router);
  private translate = inject(TranslateService);
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
    });
  }

  async ngOnInit(): Promise<void> {
    this.translate.setDefaultLang('es');
    this.auth.init();
  }
}
