import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { DashboardComponent } from '@skooltrak/ui';

@Component({
  selector: 'skooltrak-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, DashboardComponent],
  template: `
    <skooltrak-dashboard
      ><div class="container" content><router-outlet /></div>
    </skooltrak-dashboard>
  `,
  styles: [``],
})
export class AppComponent implements OnInit {
  router = inject(Router);
  title = 'host';
  ngOnInit(): void {
    this.router.resetConfig([
      {
        path: '',
        loadChildren: () =>
          import('admin/Module').then((m) => m.RemoteEntryModule),
      },
    ]);

    this.router.navigate(['']);
  }
}
