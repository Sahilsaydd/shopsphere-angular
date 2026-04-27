import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Products } from '../../core/services/products';
import { Product } from '../../core/models/product';
import { Cart } from '../../core/services/cart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
})
export class ProductDetails implements OnInit {

  private readonly destroyRef = inject(DestroyRef);

  product_details: Product | null = null;
  selectedImage: string = '';
  quantity: number = 1;
  loading = false;
  errorMessage = '';

  showCartConfirm = false;
  showBuyNowConfirm = false;

  userData = {
    name: '',
    phone: '',
    address: ''
  };

  constructor(
    private route: ActivatedRoute,
    private productService: Products,
    private cartService: Cart,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((params) => {
          const id = params.get('id');

          this.loading = true;
          this.errorMessage = '';

          if (!id) throw new Error('Missing product id');

          return this.productService.getProductById(id).pipe(
            catchError((error) => {
              console.error(error);
              this.errorMessage = 'Failed to load product';
              return EMPTY;
            }),
            finalize(() => {
              this.loading = false;
              this.cdr.detectChanges();
            })
          );
        })
      )
      .subscribe((product) => {
        this.product_details = product;
        this.selectedImage = this.getPrimaryImage(product);
      });
  }

  private getPrimaryImage(product: Product): string {
    return product.product_images?.[0] || product.product_img || '';
  }

  changeImage(img: string) {
    this.selectedImage = img;
  }

  increaseQty() {
    if (this.product_details && this.quantity < this.product_details.stock) {
      this.quantity++;
    }
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getFullStars(rating: number) {
    return Array.from({ length: Math.floor(rating) });
  }

  hasHalfStar(rating: number) {
    return rating % 1 >= 0.5;
  }

  getEmptyStars(rating: number) {
    const full = Math.floor(rating);
    const half = this.hasHalfStar(rating) ? 1 : 0;
    return Array.from({ length: 5 - full - half });
  }

  get totalPrice(): number {
    return (this.product_details?.final_price ?? 0) * this.quantity;
  }

  openCartConfirm() {
    this.showCartConfirm = true;
  }

  closeCartConfirm() {
    this.showCartConfirm = false;
  }

  confirmAddToCart() {
    if (!this.product_details) return;

    this.cartService.addToCart(this.product_details.id, this.quantity).subscribe({
      next: () => {
        this.showCartConfirm = false;
        this.quantity = 1;
      }
    });
  }

  openBuyNowConfirm() {
    this.userData = { name: '', phone: '', address: '' };
    this.showBuyNowConfirm = true;
  }

  closeBuyNowConfirm() {
    this.showBuyNowConfirm = false;
  }

  confirmBuyNow() {
    if (!this.product_details) return;

    if (!this.userData.name || !this.userData.phone || !this.userData.address) {
      alert("Please fill all fields");
      return;
    }

    this.showBuyNowConfirm = false;

    this.router.navigate(['/review'], {
      state: {
        product: this.product_details,
        quantity: this.quantity,
        user: this.userData
      }
    });
  }
}
