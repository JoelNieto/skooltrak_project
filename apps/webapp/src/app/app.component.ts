import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  selector: 'skooltrak-root',
  standalone: true,
  imports: [RouterModule, NxWelcomeComponent],

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  title = 'webapp';

  ngOnInit(): void {
    this.http
      .get<{ message: string }>('/api')
      .subscribe({ next: (item) => (this.title = item.message) });
  }
}
