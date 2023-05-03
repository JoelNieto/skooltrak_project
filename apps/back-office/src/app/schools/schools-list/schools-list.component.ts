import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'skooltrak-schools-list',
  standalone: true,
  imports: [CommonModule],
  template: `<h2 class="leading-tight tracking-tight text-2xl font-bold">
    Schools
  </h2> `,
  styles: [],
})
export class SchoolsListComponent {}
