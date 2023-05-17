import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'skooltrak-admin-students',
  standalone: true,
  imports: [RouterOutlet],
  template: `<h2
      class=" sticky top-0 bg-white dark:bg-gray-800 pb-3 leading-tight tracking-tight flex text-gray-700 dark:text-white text-2xl font-mono font-bold mb-2"
    >
      Students
    </h2>
    <router-outlet />`,
  styles: [],
})
export class StudentsComponent {}
