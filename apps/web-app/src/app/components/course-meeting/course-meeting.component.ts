import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '@skooltrak/models';
import { webStore } from '@skooltrak/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let JitsiMeetExternalAPI: any;

@Component({
    selector: 'sk-course-meeting',
    imports: [TranslateModule, MatDialogModule, MatButtonModule],
    template: `
    <h2 mat-dialog-title>
      {{ 'MEETING.TITLE' | translate }}
    </h2>

    <mat-dialog-content>
      <div id="meet"></div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-flat-button color="warn" mat-dialog-close>
        {{ 'MEETING.CLOSE' | translate }}
      </button>
    </mat-dialog-actions>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseMeetingComponent implements OnInit {
  private options: unknown;
  private api: unknown;
  private data: Course = inject(MAT_DIALOG_DATA);
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
