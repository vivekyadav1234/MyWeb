import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBase } from './form-base';


@Injectable()
export class DynamicFormService {
  constructor() { }

  toFormGroup(form: FormBase<any>[] ) {
    let group: any = {};
    form.forEach(field => {
        switch(field.attr_type){
         case 'MOB':
         group[field.attr_name] = new FormControl('', Validators.pattern("[0-9]{0-10}"))
         break;
         case 'EMAIL':
         group[field.attr_name] = new FormControl('', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'))
         break;
         default:
         if(field.required){
          group[field.attr_name] = new FormControl('', Validators.required);
         }else {
          group[field.attr_name] = new FormControl('');
         }
        }
    });
    return new FormGroup(group);
  }
}