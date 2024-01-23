import { Pipe, PipeTransform } from '@angular/core';
import { format, formatDistance, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({
  name: 'dateAgo',
  standalone: true,
  pure: true,
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
    return format(new Date(date), 'dd/MM/yyyy');
  }
}
