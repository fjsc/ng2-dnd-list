import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyprint',
  pure: false
})
export class PrettyPrintPipe implements PipeTransform {
  transform(value: any): string {
    return JSON.stringify(value, null, 2);
  }
}
