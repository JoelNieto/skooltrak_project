import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { SupabaseService } from '@skooltrak/store';

@Component({
  selector: 'skooltrak-picture',
  standalone: true,
  template: `<img [class.rounded]="rounded()" [attr.src]="src()" />`,
  styles: `
      :host {
        display: block;
      }

      img.rounded { border-radius: 50%; }
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureComponent {
  public bucket = input<string>();
  public fileName = input.required<string>();

  public rounded = input<boolean, string | boolean>(false, {
    transform: booleanAttribute,
  });

  public src = signal<SafeResourceUrl | undefined>('');

  private supabase = inject(SupabaseService);

  constructor() {
    effect(
      () => {
        const bucket = this.bucket();
        if (bucket) {
          this.src.set(this.supabase.getFileURL(this.fileName(), bucket));
        } else {
          this.src.set(this.fileName());
        }
      },
      { allowSignalWrites: true },
    );
  }
}
