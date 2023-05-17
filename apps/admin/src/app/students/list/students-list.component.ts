import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'skooltrak-admin-students-list',
  standalone: true,
  imports: [CommonModule],
  template: `<h3
    class="leading-tight tracking-tight text-gray-500 dark:text-gray-200 text-xl font-mono font-bold"
  >
    All
  </h3>`,
  styles: [],
})
export class StudentsListComponent {}
