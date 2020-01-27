import { Injectable } from '@angular/core';

@Injectable()
export class RoleService {

  constructor() { 
  	localStorage.getItem('user');
  }

}
