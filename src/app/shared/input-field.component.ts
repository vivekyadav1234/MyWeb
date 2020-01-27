import { Component, Input } from '@angular/core';
import {
  FormControl
} from '@angular/forms';
import {LoginComponent} from '../authentication/login/login.component';
import { SignUpDesignerComponent } from '../authentication/sign-up-designer/sign-up-designer.component';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  providers: [LoginComponent,SignUpDesignerComponent]
})
export class InputFieldComponent {
  @Input() attribute: string;
  @Input() placeholder: string;
  @Input() icon: string;
  @Input() type: string = 'text';
  @Input() submitted: boolean;
  @Input() control: FormControl;
  @Input() formname: string;

  onFocus(attrid) {
    
      this.loginComponent.onFocusFunction(attrid);
    
  	
  }
  constructor(
    private loginComponent: LoginComponent,
    private signUpDesignerComponent: SignUpDesignerComponent
    ) {

  }

}
