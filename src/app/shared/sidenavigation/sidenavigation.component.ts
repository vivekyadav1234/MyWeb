import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service';

import { UserDetailsService } from '../../services/user-details.service'

@Component({
  selector: 'app-sidenavigation',
  templateUrl: './sidenavigation.component.html',
  styleUrls: ['./sidenavigation.component.css'],
  providers: [UserDetailsService]
})
export class SidenavigationComponent implements OnInit {

  id : Number;
  constructor(private authService: AuthService,
              private tokenService: Angular2TokenService,
              public userDetailService: UserDetailsService
    ) {  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isLoggedOut(): boolean {
    return !this.authService.isLoggedIn();
  }

  logOut(): void {
    this.authService.logOut();
  }

  ngOnInit() {
    // this.id= this.userDetailService.current_user().id;
    // 
  }


}
