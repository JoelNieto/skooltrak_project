import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'property',
  standalone: true,
})
export class PropertyPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(value: any, args: string): unknown {
    args.split('.').forEach((element) => {
      value = value[element];
    });

    return value;
  }
}
