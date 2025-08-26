import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ReplaceMinPlusPipe' })
export class ReplaceMinPlusPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/-/g, '+');
  }
}
