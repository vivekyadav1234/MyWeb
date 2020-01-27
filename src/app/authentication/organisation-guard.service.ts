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
export class OrganisationGuardService implements CanActivate{

  constructor(private authService: AuthService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   if(localStorage.getItem('user')=='admin' || localStorage.getItem('user')=='lead_head'|| 
     localStorage.getItem('user')=='catalogue_head' || localStorage.getItem('user')=='design_head' || 
     localStorage.getItem('user')=='customer_head' || localStorage.getItem('user')=='cs_agent' || 
     localStorage.getItem('user')=='community_manager' || localStorage.getItem('user')=='broker' ||
     localStorage.getItem('user')=='category' || localStorage.getItem('user')=='business_head' ||
     localStorage.getItem('user')=='design_manager'|| localStorage.getItem('user')=='city_gm'){
    
     return true;
   }

    
	else
		return false;
  }

}
