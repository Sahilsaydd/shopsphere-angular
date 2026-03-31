import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/models/product';
import { Products } from '../../core/services/products';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
})
export class Shop implements OnInit {

  // ALL PRODUCTS
  products: Product[] = [];

  // FILTERED PRODUCTS
  filteredProducts: Product[] = [];

  // PAGINATION
  paginatedProduct: Product[] = [];
  currentpage = 1;
  itemperpage = 6;

  // CATEGORY
  categories: string[] = [];
  selectedCategory: string = 'All';

  // 💰 PRICE RANGE
  minPrice = 0;
  maxPrice = 1000;
  selectedPrice = 1000;

  constructor(
    private productService: Products,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentpage = 1;

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log("Products Count ",this.products.length)

        // ✅ Categories
        this.categories = ['All', ...new Set(this.products.map(p => p.category))];

        // ✅ Dynamic price range
        const prices = this.products.map(p => p.price);
        this.minPrice = Math.min(...prices);
        this.maxPrice = Math.max(...prices);
        this.selectedPrice = this.maxPrice;

        // ✅ Apply filters initially
        this.applyFilters();
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ CATEGORY FILTER
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.currentpage = 1;
    this.applyFilters();
  }

  // ✅ PRICE FILTER
  filterByPrice() {
    this.currentpage = 1;
    this.applyFilters();
  }

  // ✅ MAIN FILTER LOGIC (CATEGORY + PRICE)
  applyFilters() {
    this.filteredProducts = this.products.filter(product => {

      const categoryMatch =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;

      const priceMatch =
        product.price <= this.selectedPrice;

      return categoryMatch && priceMatch;
    });

    this.updatePagination();
  }

  // ✅ PAGINATION
  updatePagination() {
    const start = (this.currentpage - 1) * this.itemperpage;
    const end = start + this.itemperpage;

    this.paginatedProduct = this.filteredProducts.slice(start, end);
  }

  nextPage() {
    if (this.currentpage * this.itemperpage < this.filteredProducts.length) {
      this.currentpage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentpage > 1) {
      this.currentpage--;
      this.updatePagination();
    }
  }

  // ⭐ RATING HELPERS
  getFullStars(rating: number): number[] {
    return Array.from({ length: Math.floor(rating) }, (_, i) => i);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }

  // ❤️ WISHLIST REDIRECT
  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }
}