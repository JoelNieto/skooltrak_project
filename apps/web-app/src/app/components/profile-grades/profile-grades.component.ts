import { DecimalPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ProfileGradesStore } from './profile-grades.store';

@Component({
  selector: 'sk-profile-grades',
  standalone: true,
  providers: [ProfileGradesStore],
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    BaseChartDirective,
    TranslateModule,
    JsonPipe,
    DecimalPipe,
  ],
  template: `<div class="p-4">
    <div class="flex gap-3 w-full">
      <div class="w-2/5">
        <canvas
          baseChart
          [data]="store.chartData()"
          [options]="radarChartOptions"
          [type]="radarChartType"
        >
        </canvas>
      </div>
      <div class="p-4 shadow-lg rounded w-96">
        <h3 class="font-title text-2xl text-sky-600 mb-2">
          {{ 'STUDENTS.GRADES' | translate }}
        </h3>
        <div class="flex flex-col">
          @for (grade of store.grades(); track grade.subject) {
            <div class="flex border-b border-gray-200 p-2 justify-between">
              <span class="text-gray-500 font-sans font-light"
                >{{ grade.subject }}
              </span>
              <span class="font-mono text-sm text-sky-800">{{
                grade.score | number: '1.2-2'
              }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  </div>`,
  styles: ``,
})
export class ProfileGradesComponent {
  public store = inject(ProfileGradesStore);

  public radarChartOptions: ChartConfiguration['options'] = {
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  public radarChartType: ChartType = 'radar';
}
