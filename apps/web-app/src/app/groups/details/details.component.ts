import { Component, inject, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '@skooltrak/ui';

import { GroupsStore } from '../groups.store';

@Component({
  standalone: true,
  selector: 'sk-groups-details',
  imports: [CardComponent, TranslateModule],
  template: `<sk-card>
    <div header>
      <h2
        class="font-title flex text-2xl leading-tight tracking-tight text-gray-700 dark:text-white"
      >
        {{ store.SELECTED()?.name }}
      </h2>
    </div>
  </sk-card>`,
})
export class GroupsDetailsComponent implements OnInit {
  @Input() private group_id?: string;

  public store = inject(GroupsStore);

  public ngOnInit(): void {
    this.store.patchState({ SELECTED_ID: this.group_id });
  }
}
