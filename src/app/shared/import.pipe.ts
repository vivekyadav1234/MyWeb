import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'import'
})
export class ImportPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
