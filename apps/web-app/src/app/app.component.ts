import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { authState } from '@skooltrak/auth';

@Component({
  selector: 'sk-root',
  standalone: true,
  imports: [RouterOutlet],
  styles: [],
  template: ` <router-outlet /> `,
})
export class AppComponent implements OnInit {
  private auth = inject(authState.AuthStateFacade);
  public ngOnInit(): void {
    this.auth.init();
  }
}
