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
export class CustomerGuardService implements CanActivate{

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   if(localStorage.getItem('user')=='customer')

    return true;
	else
		return false;
  }

 //  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
 //    // if (!this.authService.isLoggedIn()) { 
 //    //   localStorage.removeItem('user');
 //    //   return true; }
 //    // if(localStorage.getItem('user')=='designer')
 //    //   this.router.navigate(['/designer']);


 //    // return false;
 //    if(localStorage.getItem('user')=='customer')

 //    return true;
	// else
	// 	return false;
 //  }

}
