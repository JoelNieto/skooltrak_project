import { Pipe, PipeTransform } from '@angular/core';
import { formatRelative } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({
  name: 'dateAgo',
  standalone: true,
  pure: false,
})
export class DateAgoPipe implements PipeTransform {
  transform(value: Date): string {
    const now = new Date();
    return formatRelative(new Date(value), now.getTime(), { locale: es });
  }
}
