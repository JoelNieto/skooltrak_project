import { Component, effect, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SupabaseService } from '@skooltrak/auth';
import { Link } from '@skooltrak/models';
import { DashboardComponent } from '@skooltrak/ui';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'skooltrak-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, DashboardComponent],
  template: ` <router-outlet /> `,
  styles: [``],
})
export class AppComponent implements OnInit {
  router = inject(Router);
  supabase = inject(SupabaseService);
  user = toSignal(this.supabase.user);
  roles = toSignal(this.supabase.roles);
  currentRole = this.supabase.currentRole;
  links: Observable<Link[]> = of([]);
  title = 'host';
  constructor() {
    effect(() => console.log(this.user()));
    effect(() => console.log(this.currentRole()?.roles));
    effect(() => {
      const role = this.currentRole()?.roles;
      !!role && (this.links = this.supabase.getLinks());
    });
  }
  ngOnInit(): void {
    this.links.subscribe({
      next: (links) => {
        console.log(links);
      },
    });
  }
}
