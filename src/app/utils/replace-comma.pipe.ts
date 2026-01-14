import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replaceComma' })
export class ReplaceCommaPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/,/g, '.');
  }
}
