import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UiComponentService } from './ui-component/ui-component.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Fixed typo: styleUrl to styleUrls
})
export class AppComponent implements OnInit {
  title = 'CafeMgmtAngular';
  isCollapsed = false;
  isAuthenticated = false;
  showNavbar = true;
  role: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private uiComponentService: UiComponentService
  ) {
    // Handle navigation events to show/hide navbar
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !(event.urlAfterRedirects === '/login' || event.urlAfterRedirects === '/signup');
      }
    });

    // Subscribe to UI component service for navbar visibility
    this.uiComponentService.navbarVisibility$.subscribe((isVisible) => {
      this.showNavbar = isVisible;
    });
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.role$.subscribe(role => {
      this.role = role;
    });

    // Reload user role if the page is refreshed
    if (this.isAuthenticated) {
      this.authService.loadUserRole();
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.toastr.success('Logged out successfully', 'Success');
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
