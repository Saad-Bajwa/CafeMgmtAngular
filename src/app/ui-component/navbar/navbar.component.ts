import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService){

  }

  onLogout(){
    this.router.navigate(['/login']);
    this.toastr.success('Logged out successfully', 'Success');
    this.authService.logout();
  }
}
