import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent, TabsComponent, TabsItemComponent } from '@skooltrak/ui';

@Component({
  standalone: true,
  selector: 'sk-school',
  imports: [
    RouterOutlet,
    CardComponent,
    TabsComponent,
    TabsItemComponent,
    TranslateModule,
  ],
  template: `<sk-card>
    <div header>
      <h2
        class="font-title mb-3 flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ 'SCHOOL.SETTINGS' | translate }}
      </h2>
    </div>
    <div>
      <sk-tabs>
        <sk-tabs-item link="info">{{ 'SCHOOL.INFO' | translate }}</sk-tabs-item>
        <sk-tabs-item link="courses">{{ 'COURSES.TITLE' | translate }}</sk-tabs-item>
        <sk-tabs-item link="plans">{{
          'PLANS.TITLE' | translate
        }}</sk-tabs-item>
        <sk-tabs-item link="subjects">{{
          'SUBJECTS.TITLE' | translate
        }}</sk-tabs-item>
        <sk-tabs-item link="degrees">{{
          'DEGREES.TITLE' | translate
        }}</sk-tabs-item>
        <sk-tabs-item link="groups">{{
          'GROUPS.TITLE' | translate
        }}</sk-tabs-item>
        <sk-tabs-item link="periods">{{
          'PERIODS.TITLE' | translate
        }}</sk-tabs-item>
        <sk-tabs-item link="people">{{
          'PEOPLE.TITLE' | translate
        }}</sk-tabs-item>
      </sk-tabs>
      <div class="p-4">
        <router-outlet />
      </div>
    </div>
  </sk-card>`,
})
export class SchoolComponent {}
