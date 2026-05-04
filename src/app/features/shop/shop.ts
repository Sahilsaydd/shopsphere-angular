import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  currentPage = 1;
  itemsPerPage = 6;

  categories: string[] = [];
  selectedCategory: string = 'All';

  minPrice = 0;
  maxPrice = 1000;
  selectedPrice = 1000;

  addingProductIds = new Set<number>();
  showCartConfirm = false;
  selectedCartProduct: Product | null = null;
  cartQuantity: number = 1;

  showWishlistPopup = false;
  selectedWishlistProduct: Product | null = null;
  imageBaseUrl = 'http://127.0.0.1:8000';
  constructor(
    private productService: Products,
    private cartService: Cart,
    private wishlistService: WishlistService,
    public router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchKeyword = params['keyword'] || '';
      this.selectedCategory = params['category'] || 'All';

      this.loading$.next(true);

      if (this.searchKeyword) {
        this.productService.searchProducts(this.searchKeyword).subscribe(data => {
          this.products$.next(data);
          this.afterDataLoad();
        });
      } else {
        this.productService.getProducts().subscribe(data => {
          this.products$.next(data);
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

    this.currentPage = 1;

    this.updatePagination();
  }

  updatePagination() {
    this.paginatedProduct$ = this.filteredProducts$.pipe(
      map(products => {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return products.slice(start, start + this.itemsPerPage);
      })
    );
  }

  nextPage() {
    this.currentPage++;
    this.updatePagination();
  }

  prevPage() {
    this.currentPage--;
    this.updatePagination();
  }

  getFullStars(rating: number) {
    return Array.from({ length: Math.floor(rating) });
  }

  hasHalfStar(rating: number) {
    return rating % 1 >= 0.5;
  }

  resolveImage(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('assets/')) {
      return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.imageBaseUrl}${normalizedPath}`;
  }

  addProductToCart(product: Product) {
    this.selectedCartProduct = product;
    this.cartQuantity = 1;
    this.showCartConfirm = true;
    this.cdr.detectChanges();
  }

  closeCartConfirm() {
    this.showCartConfirm = false;
    this.selectedCartProduct = null;
    this.cartQuantity = 1;
    this.cdr.detectChanges();
  }

  confirmAddToCart() {
    if (!this.selectedCartProduct || this.addingProductIds.has(this.selectedCartProduct.id)) return;

    this.addingProductIds.add(this.selectedCartProduct.id);

    this.cartService.addToCart(this.selectedCartProduct.id, this.cartQuantity).subscribe({
      next: () => {
        this.addingProductIds.delete(this.selectedCartProduct!.id);
        this.closeCartConfirm();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Cart error:', err);
        this.addingProductIds.delete(this.selectedCartProduct!.id);
        this.closeCartConfirm();
        this.cdr.detectChanges();
      }
    });
  }

  confirmAddToCartAndView() {
    if (this.selectedCartProduct && !this.addingProductIds.has(this.selectedCartProduct.id)) {
      this.addingProductIds.add(this.selectedCartProduct.id);

      this.cartService.addToCart(this.selectedCartProduct.id, this.cartQuantity).subscribe({
        next: () => {
          this.addingProductIds.delete(this.selectedCartProduct!.id);
          this.closeCartConfirm();
          this.cdr.detectChanges();
          this.router.navigate(['/cart']);
        },
        error: (err) => {
          console.error('Cart error:', err);
          this.addingProductIds.delete(this.selectedCartProduct!.id);
          this.closeCartConfirm();
          this.cdr.detectChanges();
        }
      });
    }
  }

  increaseCartQty() {
    if (
      this.selectedCartProduct &&
      this.selectedCartProduct.stock &&
      this.cartQuantity < this.selectedCartProduct.stock
    ) {
      this.cartQuantity++;
      this.cdr.detectChanges();
    }
  }

  decreaseCartQty() {
    if (this.cartQuantity > 1) {
      this.cartQuantity--;
      this.cdr.detectChanges();
    }
  }

  openWishlistPopup(product: Product) {
    this.selectedWishlistProduct = product;
    this.showWishlistPopup = true;
    this.cdr.detectChanges();
  }

  closeWishlistPopup() {
    this.showWishlistPopup = false;
    this.selectedWishlistProduct = null;
    this.cdr.detectChanges();
  }

  confirmAddToWishlistAndView() {
    if (this.selectedWishlistProduct) {
      this.wishlistService.add(this.selectedWishlistProduct);
    }
    this.closeWishlistPopup();
    this.router.navigate(['/wishlist']);
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

  goToProduct(id: number) {
    this.router.navigate(['/product', id]);
  }
}
