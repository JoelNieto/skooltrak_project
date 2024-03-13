import { Pipe, PipeTransform } from '@angular/core';
import { differenceInYears } from 'date-fns';

@Pipe({
  name: 'age',
  standalone: true,
  pure: true,
})
export class AgePipe implements PipeTransform {
  transform(value: Date | undefined): number {
    const birthDate = value ? new Date(value) : new Date();
    return differenceInYears(new Date(), birthDate);
  }
}
