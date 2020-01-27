import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'nextLine'})
export class NextLine implements PipeTransform {
  transform(value: string):string {
    return value.replace(/\n/g, "<br>");
  }
}