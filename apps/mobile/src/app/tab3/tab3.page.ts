import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'skooltrak-tab3',
  standalone: true,
  imports: [ExploreContainerComponent, IonicModule],
  template: `<ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Tab 3 </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>

      <skooltrak-explore-container
        name="Tab 3 page"
      ></skooltrak-explore-container>
    </ion-content> `,
  styles: [],
})
export class Tab3Page {
  constructor() {}
}
