import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'underScore'})
export class underScorePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.replace(/_/g, " ");
  }
}