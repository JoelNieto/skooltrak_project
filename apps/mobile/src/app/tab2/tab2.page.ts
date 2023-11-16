import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'skooltrak-tab2',
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Tab 2 </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>

      <skooltrak-explore-container
        name="Tab 2 page"
      ></skooltrak-explore-container>
    </ion-content>
  `,
})
export class Tab2Page {
  constructor() {}
}
