import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabsComponent, TabsItemComponent } from '@skooltrak/ui';

import { QuizzesStore } from './quizzes.store';

@Component({
  selector: 'sk-quizzes',
  standalone: true,
  imports: [RouterOutlet, TabsItemComponent, TabsComponent],
  providers: [QuizzesStore],
  template: ` <router-outlet />`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizzesComponent {}
