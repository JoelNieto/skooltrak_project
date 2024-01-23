import { Component, inject } from '@angular/core';
import { mobileStore } from '@skooltrak/store';

import { CourseGradesComponent } from './course-grades.component';
import { StudentGradesComponent } from './student-grades.component';

@Component({
  standalone: true,
  selector: 'sk-grades',
  imports: [CourseGradesComponent, StudentGradesComponent],
  template: ` @if (auth.isAdmin() || auth.isTeacher()) {
      <sk-course-grades />
    }
    @if (auth.isStudent()) {
      <sk-student-grades />
    }`,
})
export class GradesComponent {
  public auth = inject(mobileStore.AuthStore);
}
