import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { providers } from './providers';

bootstrapApplication(AppComponent, {
  providers: [...providers],
});
