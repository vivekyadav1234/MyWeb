import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'taxType'})
export class TaxTypePipe implements PipeTransform {
    transform(value) {
        if(value=='cgst_sgst'){
            return 'CGST & SGST'
        }
        else if(value=='igst'){
            return 'IGST'
        }
        else{
            return value;
        }
    }
}