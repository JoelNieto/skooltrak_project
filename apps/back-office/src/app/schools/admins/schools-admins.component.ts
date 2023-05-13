import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'skooltrak-schools-admins',
  standalone: true,
  imports: [CommonModule],
  template: `<p>schools-admins works!</p>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SchoolsAdminsComponent {}
