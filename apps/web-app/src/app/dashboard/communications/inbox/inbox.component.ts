import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { webStore } from '@skooltrak/store';

import { FileUrlPipe } from '../../../auth/pipes/file-url.pipe';
import { AvatarComponent } from '../../../components/avatar/avatar.component';

@Component({
  selector: 'sk-inbox',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterOutlet,
    AvatarComponent,
    FileUrlPipe,
  ],
  template: `<mat-sidenav-container class="h-[80vh]">
    <mat-sidenav opened mode="side">
      <mat-nav-list>
        @for (chat of store.sortedChats(); track chat.id) {
          @if (chat.members[0].user; as user) {
            <a mat-list-item>
              <img
                matListItemAvatar
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxComponent {
  public store = inject(webStore.MessagesStore);
}
