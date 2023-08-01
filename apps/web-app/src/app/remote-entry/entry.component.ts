import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [CommonModule, NxWelcomeComponent],
  selector: 'skooltrak-web-app-entry',
  template: `<skooltrak-nx-welcome></skooltrak-nx-welcome>`,
})
export class RemoteEntryComponent {}
