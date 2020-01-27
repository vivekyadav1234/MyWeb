import { Component, OnInit } from '@angular/core';
import { Angular2TokenService } from 'angular2-token';
import { AuthService } from '../../authentication/auth.service';

import { UserDetailsService } from '../../services/user-details.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [UserDetailsService]
})
export class HeaderComponent implements OnInit {

 role: string;
 leadMgmtAccess = ['admin','lead_head', 'customer_head'];
 catalogueMgmtAccess = ['admin','catalogue_head'];
 portfolioAccess = ['admin'];
 boqAcess = ['admin'];
 userMgmtAccess = ['admin','design_head','customer_head'];
 projectAccess = ['admin','customer','designer','design_head'];
 profileAccess=['admin','customer','designer','catalogue_head','design_head','lead_head','broker','customer_head'];

  constructor(private authService: AuthService,
              private tokenService: Angular2TokenService,
              public userDetailService: UserDetailsService
    ) {
    this.role=localStorage.getItem('user');
    //
    //this.userName = this.userDetailService.user_auth_data().uid;

    
  }

  ngOnInit() {
    this.role=localStorage.getItem('user');
    
    //
    //$("#bootstrap4").attr("disabled", "disabled");
  }
  


  isLoggedIn(): boolean {
    this.role=localStorage.getItem('user');
    //
    // 
    return this.authService.isLoggedIn();
  }

  isLoggedOut(): boolean {
    return !this.authService.isLoggedIn();
  }

  logOut(): void {
    this.authService.logOut();
  }

}
