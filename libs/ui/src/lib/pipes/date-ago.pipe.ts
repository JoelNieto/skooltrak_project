import { Pipe, PipeTransform } from '@angular/core';
import { format, isSameDay, isSameWeek } from 'date-fns';
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
      return format(new Date(date), 'h:mm aaaa', {
        locale: es,
      });
    }
    if (isSameWeek(now, date)) {
      return format(new Date(date), 'eeee', { locale: es });
    }
    return format(new Date(date), 'dd/MM/yyyy');
  }
}
