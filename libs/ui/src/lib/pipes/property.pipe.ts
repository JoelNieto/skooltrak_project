import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'property',
  standalone: true,
})
export class PropertyPipe implements PipeTransform {
  transform(value: any, args: string): any {
    args.split('.').forEach((element) => {
      value = value[element];
    });

    return value;
  }
}
