import { Component } from '@angular/core';

import { AuthService } from './auth.service';

@Component({
  selector: 'auth-links',
  templateUrl: './auth-links.component.html',
    styleUrls: ['./auth-links.component.css']
})
export class AuthLinksComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isLoggedOut(): boolean {
    return !this.authService.isLoggedIn();
  }

  logOut(): void {
    this.authService.logOut();
  }
}