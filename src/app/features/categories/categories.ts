import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { categories, CategoryService } from '../../core/services/categories';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent implements OnInit {

  categories: categories[] =[];

  constructor(private categoriesServices: CategoryService) {}

  ngOnInit(): void {
    console.log('Component loaded');

    this.categoriesServices.getCategories().subscribe({
      next: (data) => {
        console.log('DATA RECEIVED:', data);
        this.categories = data;
      },
      error: (err) => {
        console.error('ERROR:', err);
      }
    });
  }

}