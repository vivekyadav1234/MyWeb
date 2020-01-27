import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'passFail'})
export class PassFailPipe implements PipeTransform {
    transform(value) {

            return value ? 'Pass' : 'Fail';
        
    }
}
