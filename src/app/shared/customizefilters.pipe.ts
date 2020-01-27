import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'replaceChar'})
export class ReplaceChar implements PipeTransform {
  transform(value: string): string {
  		if(value != null) {
	    let newStr: string = "";
	   	newStr = value.replace(/_/g, ' ');
	   	var finalstr = newStr.charAt(0).toUpperCase() + newStr.slice(1);

	    return finalstr;
		}
	}
}