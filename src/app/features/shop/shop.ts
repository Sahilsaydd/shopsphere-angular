import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/models/product';
import { Products } from '../../core/services/products';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
})
export class Shop implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProduct: Product[] = [];

  currentpage = 1;
  itemperpage = 6;

  categories: string[] = [];
  selectedCategory: string = 'All';

  minPrice = 0;
  maxPrice = 1000;
  selectedPrice = 1000;

  constructor(
    private productService: Products,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    // ✅ STEP 1: Load products FIRST
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;

        console.log("Products Loaded:", this.products.length);

        // Categories
        this.categories = ['All', ...new Set(this.products.map(p => p.category))];

        // Price range
        const prices = this.products.map(p => p.price);
        this.minPrice = Math.min(...prices);
        this.maxPrice = Math.max(...prices);
        this.selectedPrice = this.maxPrice;

        // ✅ STEP 2: Now listen to query params AFTER products loaded
        this.route.queryParams.subscribe(params => {
          this.selectedCategory = params['category'] || 'All';

          console.log("Selected Category:", this.selectedCategory);

          this.currentpage = 1;
          this.applyFilters();   // ✅ NOW it will work
        });

      },
      error: (err) => console.error(err)
    });
  }

  // ✅ CATEGORY CLICK
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.currentpage = 1;

    this.router.navigate([], {
      queryParams: { category: category === 'All' ? null : category },
      queryParamsHandling: 'merge'
    });

    this.applyFilters();
  }

  // ✅ PRICE FILTER
  filterByPrice() {
    this.currentpage = 1;
    this.applyFilters();
  }

  // ✅ MAIN FILTER LOGIC
  applyFilters() {

    this.filteredProducts = this.products.filter(product => {

      const categoryMatch =
        this.selectedCategory === 'All' ||
        product.category === this.selectedCategory;

      const priceMatch =
        product.price <= this.selectedPrice;

      return categoryMatch && priceMatch;
    });

    console.log("Filtered Products:", this.filteredProducts.length);

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

  // ⭐ RATING
  getFullStars(rating: number): number[] {
    return Array.from({ length: Math.floor(rating) }, (_, i) => i);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }
}