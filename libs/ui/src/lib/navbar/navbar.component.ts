import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'skooltrak-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `<p>navbar works!</p>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class NavbarComponent {}
