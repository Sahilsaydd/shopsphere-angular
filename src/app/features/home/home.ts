import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Products } from '../../core/services/products';
import { Product } from '../../core/models/product';
import { RouterModule } from '@angular/router';
import { CategoriesComponent } from '../categories/categories';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule ,CategoriesComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  allTrendingProducts: Product[] = [];
  visibleProducts: Product[] = [];

  currentIndex = 0;
  itemsPerPage = 4;

  constructor(private productService: Products) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {

      // 🔥 Get top 10 trending (by rating)
      this.allTrendingProducts = data
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

      this.updateVisibleProducts();
    });
  }

  updateVisibleProducts() {
    this.visibleProducts = this.allTrendingProducts.slice(
      this.currentIndex,
      this.currentIndex + this.itemsPerPage
    );
  }

  nextProducts() {
    if (this.currentIndex + this.itemsPerPage < this.allTrendingProducts.length) {
      this.currentIndex += this.itemsPerPage;
      this.updateVisibleProducts();
    }
  }

  prevProducts() {
    if (this.currentIndex > 0) {
      this.currentIndex -= this.itemsPerPage;
      this.updateVisibleProducts();
    }
  }
}