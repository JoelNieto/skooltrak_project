import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';

import { SchoolsService } from './schools.service';
import { SchoolsStore } from './schools.store';

@Component({
  selector: 'skooltrak-schools',
  imports: [RouterOutlet],
  standalone: true,
  providers: [provideComponentStore(SchoolsStore), SchoolsService],
  template: ` <router-outlet />`,
})
export class SchoolsComponent {}
