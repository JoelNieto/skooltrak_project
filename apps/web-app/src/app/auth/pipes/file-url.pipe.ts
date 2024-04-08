import { inject, Pipe, PipeTransform } from '@angular/core';
import { FileBucket } from '@skooltrak/models';
import { SupabaseService } from '@skooltrak/store';

@Pipe({
  name: 'fileUrl',
  standalone: true,
})
export class FileUrlPipe implements PipeTransform {
  private supabase = inject(SupabaseService);
  public transform(url: string, bucket: FileBucket): string {
    return this.supabase.getFileURL(url, bucket);
  }
}
