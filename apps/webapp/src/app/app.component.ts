import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'skooltrak-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`,
  styles: [],
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
