import { Component, Input } from '@angular/core';
import { FormGroup }        from '@angular/forms';
import { FormBase } from './form-base';
 
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent {
  @Input() field: FormBase<any>;
  @Input() form: FormGroup;
  get isValid() {
    //   this.form.controls[this.field.fieldLable].setValue(this.field.fieldMeta.defaultValue);
      return this.form.controls[this.field.attr_name].valid; 
    }

    // keyPress(event: any) {
    //     const pattern = /[0-9\+\-\ ]/;
    
    //     let inputChar = String.fromCharCode(event.charCode);
    //     if (event.keyCode != 8 && !pattern.test(inputChar)) {
    //       event.preventDefault();
    //     }
    //   }
}