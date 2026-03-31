import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriesComponent } from '../categories/categories';

@Component({
  selector: 'app-home',
  
  standalone: true,
  imports: [RouterLink, CategoriesComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {}