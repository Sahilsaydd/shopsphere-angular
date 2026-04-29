import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule,FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  constructor(public auth:Auth ,private router:Router){}

  searchText: string = '';

onSearch(event: Event) {
  event.preventDefault();

  if (this.searchText.trim()) {
    this.router.navigate(['/shop'], {
      queryParams: { keyword: this.searchText }
    });
  }
}

  logout() {
  this.auth.logout('user').subscribe({
    next: () => {
      alert("Logged out successfully!");
      this.router.navigate(['/login']);
    },
    error: () => {
      alert("Logout failed. Please try again.");
    }
  });
}

}

