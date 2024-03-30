import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '@skooltrak/models';
import { webStore } from '@skooltrak/store';
import { CardComponent } from '@skooltrak/ui';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let JitsiMeetExternalAPI: any;

@Component({
  selector: 'sk-course-meeting',
  standalone: true,
  imports: [TranslateModule, CardComponent, MatButton],
  template: `<sk-card>
    <div header>
      <h3
        class="font-title text-xl font-semibold text-gray-700 dark:text-gray-100"
      >
        {{ 'MEETING.TITLE' | translate }}
      </h3>
    </div>
    <div class="flex items-center justify-center">
      <div id="meet"></div>
    </div>
    <div footer class="flex justify-end">
      <button mat-flat-button color="warn" (click)="dialogRef.close()">
        {{ 'MEETING.CLOSE' | translate }}
      </button>
    </div>
  </sk-card>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseMeetingComponent implements OnInit {
  private options: unknown;
  private api: unknown;
  public dialogRef = inject(DialogRef);
  private data: Course = inject(DIALOG_DATA);
  private auth = inject(webStore.AuthStore);

  public ngOnInit(): void {
    this.options = {
      roomName: `SkooltrakMeet-${this.data.id}`,
      width: 1000,
      height: 600,
      userInfo: {
        email: this.auth.user()?.email,
        displayName: `${this.auth.user()?.first_name}  ${this.auth.user()
          ?.father_name}`,
      },
      parentNode: document.querySelector('#meet'),
    };

    this.api = new JitsiMeetExternalAPI('meet.skooltrak.com', this.options);
  }
}
