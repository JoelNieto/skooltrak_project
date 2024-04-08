import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { QuizzesStore } from './quizzes.store';

@Component({
  selector: 'sk-quizzes',
  standalone: true,
  imports: [RouterOutlet],
  providers: [QuizzesStore],
  template: ` <router-outlet />`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizzesComponent {}
