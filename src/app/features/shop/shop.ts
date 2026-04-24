import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/models/product';
import { Products } from '../../core/services/products';
import { Cart } from '../../core/services/cart';
import { WishlistService } from '../../core/services/wishlist';

import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
})
export class Shop implements OnInit {

  products$ = new BehaviorSubject<Product[]>([]);
  filteredProducts$ = new BehaviorSubject<Product[]>([]);
  paginatedProduct$!: Observable<Product[]>;
  searchKeyword: string = '';
  loading$ = new BehaviorSubject<boolean>(false);
  currentpage = 1;
  itemperpage = 6;

  categories: string[] = [];
  selectedCategory: string = 'All';

  minPrice = 0;
  maxPrice = 1000;
  selectedPrice = 1000;

  // POPUPS
  showCartPopup = false;
  selectedProduct: any = null;
  showWishlistPopup = false;
  selectedWishlistProduct: any = null;

  constructor(
    private productService: Products,
    private cartService: Cart,
    private wishlistService: WishlistService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

ngOnInit(): void {

  this.route.queryParams.subscribe(params => {
    this.searchKeyword = params['keyword'] || '';
    this.selectedCategory = params['category'] || 'All';

    this.loading$.next(true);

    if (this.searchKeyword) {
      // 🔍 CALL SEARCH API
      this.productService.searchProducts(this.searchKeyword).subscribe(data => {
        this.products$.next(data);
        console.log('Search results:', data);

        this.afterDataLoad();
      });
    } else {
      // 📦 LOAD ALL PRODUCTS
      this.productService.getProducts().subscribe(data => {

        this.products$.next(data);
          console.log('All products loaded:', data);
        this.afterDataLoad();
      });
    }
  });

}
  filterByCategory(category: string) {
    this.selectedCategory = category;

    this.router.navigate([], {
      queryParams: { category: category === 'All' ? null : category },
      queryParamsHandling: 'merge'
    });

    this.applyFilters();
  }

  filterByPrice() {
    this.applyFilters();
  }

  applyFilters() {
    const products = this.products$.value;
    const filtered = products.filter(product => {
      return (
        (this.selectedCategory === 'All' ||
          product.category === this.selectedCategory) &&
        product.price <= this.selectedPrice
      );
    });

    this.filteredProducts$.next(filtered);
    this.updatePagination();
  }

  updatePagination() {
  this.paginatedProduct$ = this.filteredProducts$.pipe(
    map(products => {
      const start = (this.currentpage - 1) * this.itemperpage;
      return products.slice(start, start + this.itemperpage);
    })
  );
}

  nextPage() {
    this.currentpage++;
    this.updatePagination();
  }

  prevPage() {
    this.currentpage--;
    this.updatePagination();
  }

  getFullStars(rating: number) {
    return Array.from({ length: Math.floor(rating) });
  }

  hasHalfStar(rating: number) {
    return rating % 1 >= 0.5;
  }

  // CART POPUP
  openCartPopup(product: any) {
    this.selectedProduct = product;
    this.showCartPopup = true;
  }

  confirmAddToCart() {
    this.cartService.addToCart(this.selectedProduct);
    this.showCartPopup = false;
  }

  confirmAddToCartAndView() {
    this.cartService.addToCart(this.selectedProduct);
    this.showCartPopup = false;
    this.goToCartpage();
  }

  closePopup() {
    this.showCartPopup = false;
  }

  openWishlistPopup(product: any) {
    this.selectedWishlistProduct = product;
    this.showWishlistPopup = true;
  }

  confirmAddToWishlist() {
    if (this.selectedWishlistProduct) {
      this.wishlistService.add(this.selectedWishlistProduct);
      this.selectedWishlistProduct = null;
    }
    this.showWishlistPopup = false;
  }

  confirmAddToWishlistAndView() {
    if (this.selectedWishlistProduct) {
      this.wishlistService.add(this.selectedWishlistProduct);
      this.selectedWishlistProduct = null;
    }
    this.showWishlistPopup = false;
    this.goToWishlist();
  }

  closeWishlistPopup() {
    this.showWishlistPopup = false;
    this.selectedWishlistProduct = null;
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
  }

  goToCartpage() {
    this.router.navigate(['/cart']);
  }


  afterDataLoad() {
  this.loading$.next(false);

  const products = this.products$.value;
  this.categories = ['All', ...new Set(products.map(p => p.category))];

  const prices = products.map(p => p.price);
  this.minPrice = Math.min(...prices);
  this.maxPrice = Math.max(...prices);
  this.selectedPrice = this.maxPrice;

  this.applyFilters();
}



// go to product navigate

goToProduct(id:number){

  console.log('Navigating to product with ID:', id);

  this.router.navigate(['/product', id]);
}

}
