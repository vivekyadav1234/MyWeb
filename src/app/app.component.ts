import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from './authentication/auth.service';
import { environment } from 'environments/environment';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, ActivatedRoute , Params,  Event as RouterEvent,} from '@angular/router';
import { Title } from '@angular/platform-browser';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { LoaderService } from './services/loader.service';
import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';
declare let ga: Function;
declare let $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent {
  showLoader: boolean;
  constructor(
    private _authService: AuthService,
    private loaderService: LoaderService,
    private _tokenService: Angular2TokenService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private slimLoadingBarService: SlimLoadingBarService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService
  ) {
      this._tokenService.init({
        apiBase:                    environment.apiBaseUrl,
        validateTokenPath:          'auth/validate_token',
        registerAccountPath:        'auth',
        registerAccountCallback:    '/dashboard',
        signInPath:                 'auth/sign_in',
        signInRedirect:             '/auth/login',
        signOutPath:                'auth/sign_out',
        signOutFailedValidate:      true,
        resetPasswordCallback: environment.uiBaseUrl+'/reset-password'
      });

      router.events.subscribe((event: RouterEvent) => {
        this.navigationInterceptor(event)
      })


      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview');
          // document.getElementById('errorMsgDiv').style.display = 'none';
        }
      });

    }
  url;
  ngOnInit() {
    console.log('%cBelow Are Arrivae Error Logs :',"font-family: Arial, Helvetica, sans-serif; font-size:24px; color:#8c031f");
    this.url=location.origin;
     
     
    if(!this.isLoggedIn()){
      localStorage.clear();
      if((window.location.pathname ==='/reset-password') || (window.location.pathname === '/lead/pdf-viewer')
       || (window.location.pathname === '/lead/app-sms-floorplan')){
        
        // this.router.navigate(['/logout']);
      }else {
        this.router.navigate(['/log-in']);
      }
    }
    this.loaderService.status.subscribe((val: boolean) => {
            this.showLoader = val;
        });
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
    // TODO: assign proper type to event
    this.router.events.subscribe((event: any): void => {
      this.navigationInterceptor(event);
    });
    this.activatedRoute
      .queryParams
      .subscribe(params => {
        var status = params['change_password'];
        if(status=='undefined'|| status=='false')
          localStorage.setItem('changePasswordStatus','false');
        else if(status=='true')
          localStorage.setItem('changePasswordStatus','true');
      });


  }

  ngAfterViewInit(){
    // $('[data-toggle="tooltip"]').tooltip();
  }

  // ngAfterViewInit() {
  //    this.loaderService.status.subscribe((val: boolean) => {
  //           this.showLoader = val;
  //       });
  // }

  isLoggedIn(): boolean {
    return this._authService.isLoggedIn();
  }

  isLoggedOut(): boolean {
    return !this._authService.isLoggedIn();
  }

  isCustomer(): boolean{
    var role = localStorage.getItem('user')
    if(role == 'customer' || role=='catalog_viewer'){
      return true
    }
    else{
      return false
    }
  }

  logOut(): void {
    localStorage.clear();
    this._authService.logOut();
  }

  startLoading() {
    this.slimLoadingBarService.start(() => {
    });
  }

  stopLoading() {
    this.slimLoadingBarService.stop();
  }

  completeLoading() {
    this.slimLoadingBarService.complete();
  }

  navigationInterceptor(event): void {
    if (event instanceof NavigationStart) {
     // this.showLoader = true;
      this.startLoading();
      //alert("start");
    }
    if (event instanceof NavigationEnd) {
      // this.showLoader = false;
      this.completeLoading();
     // alert("end");
    }
    if (event instanceof NavigationCancel) {
       //this.showLoader = false;
      this.completeLoading();
    }
    if (event instanceof NavigationError) {
      // this.showLoader = false;
      this.completeLoading();
    }
  }

  submitEvent() {
    this.googleAnalyticsEventsService.emitEvent("testCategory", "testAction", "testLabel", 10);
  }
}
