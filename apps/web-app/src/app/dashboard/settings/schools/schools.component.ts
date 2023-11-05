import { Component } from '@angular/core';
import { ButtonDirective, SelectComponent } from '@skooltrak/ui';

@Component({
  standalone: true,
  selector: 'sk-schools',
  imports: [ButtonDirective, SelectComponent],
  template: `<div class="flex justify-between">
    <div class="w-64"></div>
  </div>`,
})
export class SchoolsComponent {}
