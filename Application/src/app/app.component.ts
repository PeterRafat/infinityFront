import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from "./admin/adminComponents/admin-navbar/admin-navbar.component";

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, FooterComponent, CommonModule, AdminNavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'infinity';
  constructor(private router: Router) {}

  isAdminPage(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
