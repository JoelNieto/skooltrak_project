import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { authState } from '@skooltrak/auth';
import { Course } from '@skooltrak/models';
import { ButtonDirective, CardComponent } from '@skooltrak/ui';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let JitsiMeetExternalAPI: any;

@Component({
  selector: 'sk-course-meeting',
  standalone: true,
  imports: [TranslateModule, CardComponent, ButtonDirective],
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
      <button skButton color="red" (click)="dialogRef.close()">
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
  private auth = inject(authState.AuthStateFacade);

  public ngOnInit(): void {
    this.options = {
      roomName: `SkooltrakMeet-${this.data.id}`,
      width: 1000,
      height: 600,
      userInfo: {
        email: this.auth.USER()?.email,
        displayName: `${this.auth.USER()?.first_name}  ${this.auth.USER()
          ?.father_name}`,
      },
      parentNode: document.querySelector('#meet'),
    };

    this.api = new JitsiMeetExternalAPI('meet.skooltrak.com', this.options);
  }
}
