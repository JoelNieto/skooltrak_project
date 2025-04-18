import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { webStore } from '@skooltrak/store';

import { FileUrlPipe } from '../../../auth/pipes/file-url.pipe';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'sk-inbox',
    imports: [
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        RouterOutlet,
        RouterLink,
        FileUrlPipe,
        MatButtonModule,
        TranslateModule,
    ],
    template: ` <mat-sidenav-container class="h-[82vh]">
    <mat-sidenav opened mode="side">
      <button mat-stroked-button class="self-center">
        <mat-icon>add_comment</mat-icon>
        {{ 'MESSAGING.NEW_CHAT' | translate }}
      </button>
      <mat-nav-list>
        @for (chat of store.sortedChats(); track chat.id) {
          @if (chat.members[0].user; as user) {
            <a mat-list-item [routerLink]="chat.id">
              <img
                matListItemAvatar
                [alt]="user.father_name"
                [src]="user.avatar_url! | fileUrl: 'avatars'"
              />
              <div matListItemTitle>
                {{ user.first_name }}
                {{ user.father_name }}
              </div>
              <div matListItemLine>
                {{ user.email }}
              </div>
            </a>
          }
        }
      </mat-nav-list>
    </mat-sidenav>
    <mat-sidenav-content>
      <router-outlet />
    </mat-sidenav-content>
  </mat-sidenav-container>`,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxComponent {
  public store = inject(webStore.MessagesStore);
}
