import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanActivate
}                           from '@angular/router';
import { AuthService }      from './auth.service';

@Injectable()
export class DesignerGuardService implements CanActivate{

  constructor(private authService: AuthService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   if(localStorage.getItem('user')=='designer')

    return true;
	else
		return false;
  }

}


