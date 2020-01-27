import { Injectable }       from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
}                           from '@angular/router';
import { AuthService }      from './auth.service';

@Injectable()
export class LoggedOutGuard implements CanActivateChild {

  role: String;
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkGuest(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) { 
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('changePasswordStatus');
      return true; }
    
    return false;
  }


  private checkGuest(url: string): boolean {
    if (!this.authService.isLoggedIn()) { return true; }
    this.role = localStorage.getItem('user');
    this.authService.redirectUrl = url;

    if(this.role != null) {
      if(this.role == "customer_head") { 
        this.router.navigate(['/user-roles/listusers']);
      } else if(this.role == ("category_head")){
        this.router.navigate(['/category/manage_master_data']);
      }else if(this.role == ("design_manager")){
        this.router.navigate(['/general-manager/gm-dashboard']);
      }else if(this.role.includes("customer")) {
        this.router.navigate(['/customer']);
      } else if(this.role.includes("admin")) {
          this.router.navigate(['/organisation']);
      } else if(this.role.includes("designer")) {
          this.router.navigate(['/designer']);
      } else if(this.role.includes("lead_head")) {
          this.router.navigate(['/organisation']);
      } else if(this.role.includes("catalogue_head")) {
          this.router.navigate(['/catalogue/list']);
      } else if(this.role.includes("design_head")) {
          this.router.navigate(['/organisation']);
      } else if(this.role.includes("cs_agent")) {
          this.router.navigate(['/organisation/csagent']);
      } else if(this.role.includes("broker")) {
          this.router.navigate(['/organisation/broker']);
      } else if(this.role.includes("community_manager")) {
          this.router.navigate(['/organisation/community_manager']);
      } else if(this.role.includes("finance")) {
        this.router.navigate(['/finance']);
      } else if(this.role.includes("category")) {
          this.router.navigate(['/category/tasks']);
      } else if(this.role.includes("sitesupervisor")) {
        this.router.navigate(['/sitesupervisor/dashboard']);
      } else if(this.role.includes("cad")) {
        this.router.navigate(['/cad/dashboard']);
      } else if(this.role.includes("vendor")) {
        this.router.navigate(['/vendor/dashboard']);
      } else if(this.role.includes("referral")) {
        this.router.navigate(['/referral/dashboard']);
      }else if(this.role.includes("order_manager")) {
        this.router.navigate(['/order_manager/dashboard']);
      } else if(this.role.includes("catalog_viewer")) {
        this.router.navigate(['/catalogue']);
      } else if(this.role.includes("business_head")){
        this.router.navigate(['/cm-variable-margins']);
      }else if(this.role.includes("city_gm")){
        this.router.navigate(['/general-manager/gm-dashboard']);
      }else if(this.role.includes("sales_manager")){
        this.router.navigate(['/salesmanager/dashboard']);
      }else if(this.role.includes("arrivae_champion")){
        this.router.navigate(['/referral/dashboard']);
      }else if(this.role.includes("others")){
        this.router.navigate(['/referral/dashboard']);
      }else if(this.role.includes("developer")){
        this.router.navigate(['/referral/dashboard']);
      } else if(this.role.includes("associate_partner")){
        this.router.navigate(['/referral/dashboard']);
      }
    }
    if(this.role== null){

      this.router.navigate(['/log-in']);
    }

    return false;
  }
}
