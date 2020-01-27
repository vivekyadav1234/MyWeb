import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { Routes, RouterModule , Router,ActivatedRoute} from '@angular/router';
import { AuthService } from '../../authentication/auth.service';
import { UserDetailsService } from '../../services/user-details.service';
import {CsagentService} from '../../platform/organisation/csagentdashboard/csagent.service';
import { ProfileService } from '../../platform/profile/profile/profile.service';
declare var $:any;
@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.css'],
 //  styles: [require('./sidenavbar.component.css'), '.active { background-color: red; }'], 
  // styles: ['.router-link-active { background-color: red; }'],
  providers: [UserDetailsService, CsagentService,ProfileService]
})
export class SidenavbarComponent implements OnInit {

 role: string;
 leadMgmtAccess = ['admin','lead_head', 'customer_head'];
 brokerMgmtAccess = ['admin','lead_head'];
 csagentlistAccess = ['admin','lead_head'];
 catalogueMgmtAccess = ['admin','catalogue_head','design_head','designer','catalog_viewer','community_manager','category_panel','category_non_panel','category_services','category_head'];
 portfolioAccess = ['admin'];
 testimonialAccess = ['admin'];
 boqAcess = ['admin'];
 userMgmtAccess = ['admin','design_head','customer_head'];
 projectAccess = ['admin','customer','designer','design_head','lead_head'];
 profileAccess=['admin','customer','designer','catalogue_head','design_head','lead_head',
 'broker','customer_head','cs_agent','community_manager','referral'];
 designerPortfolioAccess = ['designer','design_head','admin'];
 categoryDataAccess = ['admin','category_head','category_panel','category_non_panel','category_services'];//V:Category Login to be divided into 3 parts-(Category Non Panel,Category Panel,Category Services) All the Category Team Logins to be divided into one of the options and action will perform according role.Category Head have all three access.
 global_preset_access=['category_panel','category_non_panel','category_services','designer','category_head'];
 cm_variable_margin_access=['business_head','category_panel','category_non_panel','category_services','community_manager','category_head'];
 admin_metric_access = ['admin','business_head'];
 emi_calculator_access = ['designer'];
 window=window;
 route_url;
 userData;
 navurl;

  constructor(
    private authService: AuthService,
    private tokenService: Angular2TokenService,
    public userDetailService: UserDetailsService,
    public csagentService:CsagentService,
    public profileService:ProfileService,
    public route:ActivatedRoute,
    public router:Router
  ) { 
    this.role=localStorage.getItem('user');
  }
  pageloadbool = true;

  ngOnInit() {
    this.role=localStorage.getItem('user');
    if(this.role=='lead_head' || this.role=='admin' || this.role=='cs_agent'){
      this.getLeadPoolList();
    }
    if(localStorage.getItem('userId')!=null){
      this.viewProfile(localStorage.getItem('userId'));
    }
    this.route_url = this.router.url;
    // 
     
     this.navurl=window.location.pathname;
     
  }
  
  isLoggedIn(): boolean {
    this.role=localStorage.getItem('user');
    this.userData = this.userDetailService.current_user();
    if(this.pageloadbool && this.userData){
      this.viewProfile(this.userData.id);
      this.pageloadbool = false;
    }
    return this.authService.isLoggedIn();
  }

  isLoggedOut(): boolean {
    return !this.authService.isLoggedIn();
  }

  logOut(): void {
    this.authService.logOut();
    // window.location.reload();
  }
  addClass(e) {
    
    e=<HTMLElement>e;
    $("#menu li").removeClass('activeMenu');
    $(e.srcElement).parent().addClass('activeMenu');
    var flag=$('.activeMenu')[0].lastElementChild.classList.contains('submenu-container');
    if(flag){
      $('.submenu-container').removeClass('d-none');
    } else {
       $('.submenu-container').addClass('d-none');
    }
    // if($(".collapse").hasClass('show'))
    //   $(".collapse").removeClass('show');
  }

  changeSubMenuCss(e){
    e=<HTMLElement>e;
    $('.rk-activeSubMenuLink a').removeClass('activeSubMenuLinkColor');
    // $('.rk-activeSubMenuLink').style.color = 'black';
    $(e.srcElement).addClass('activeSubMenuLinkColor');
  }
  activeSubmenu(e){
    $('.submenu-title').removeClass('activeSubMenuLinkColor');
    $(e.srcElement).addClass('activeSubMenuLinkColor');
  }
  
  designer_typeid;
  getLeadPoolList(){
    this.csagentService.getLeadPoolList().subscribe(
        res=> {
          
          for(var i=0;i<res['lead_types'].length;i++){
            if(res['lead_types'][i].name=='designer'){
              this.designer_typeid = res['lead_types'][i].id
            }
            
          }
        },
        err => {
        }
      );
  }

  changeRouterLink(sidenavoption){
    if(sidenavoption=='Designer'){
      this.router.navigate(['/leads'], { queryParams: {lead_type:'Designer','id':this.designer_typeid} });
    }
    if(sidenavoption=='Lead'){
      this.router.navigate(['/leads']);
    }
  }

  profile;
  viewProfile(id){
    // this.loaderService.display(true);

     this.profileService.viewProfile(id).subscribe(
        profile => {
          this.profile = profile;
          Object.keys(profile).map((key)=>{ this.profile= profile[key];});
        },
        error => {

        }
      );
  }
  openNav() {
    document.getElementById("mySidenav").style.width = "275px";
    document.getElementById("mySideNavDiv").style.width = "100%";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mySideNavDiv").style.width = "0";
  }

}