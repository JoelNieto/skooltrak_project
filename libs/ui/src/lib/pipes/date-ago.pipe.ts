import { Pipe, PipeTransform } from '@angular/core';
import { formatDistance, formatRelative, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({
  name: 'dateAgo',
  standalone: true,
  pure: false,
})
export class DateAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    const now = new Date();
    const date = new Date(value);
    if (isSameDay(now, date)) {
      return formatDistance(new Date(date), now.getTime(), {
        locale: es,
        addSuffix: true,
      });
    }
    return formatRelative(new Date(date), now.getTime(), { locale: es });
  }
}
