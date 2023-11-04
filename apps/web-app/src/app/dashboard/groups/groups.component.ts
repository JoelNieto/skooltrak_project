import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';

import { GroupsStore } from './groups.store';

@Component({
  standalone: true,
  selector: 'sk-groups',
  imports: [RouterOutlet],
  providers: [provideComponentStore(GroupsStore)],
  template: `<router-outlet />`,
})
export class GroupsComponent {}
