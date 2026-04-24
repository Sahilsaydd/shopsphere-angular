import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Products } from '../../core/services/products';
import { Product } from '../../core/models/product';
import { Cart } from '../../core/services/cart';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
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
          this.product_details = null;
          this.selectedImage = '';
          this.quantity = 1;

          if (!id) {
            throw new Error('Missing product id in route.');
          }

          return this.productService.getProductById(id).pipe(
            catchError((error) => {
              console.error('Failed to load product details:', error);
              this.errorMessage = 'Unable to load this product right now.';
              return EMPTY;
            }),
            finalize(() => {
              this.loading = false;
              this.cdr.detectChanges();
            })
          );
        })
      )
      .subscribe({
        next: (product) => {
          console.log('Product details response:', product);
          this.product_details = product;
          this.selectedImage = this.getPrimaryImage(product);
          this.cdr.detectChanges();
        }
      });
  }

  private getPrimaryImage(product: Product): string {
    if (Array.isArray(product.product_images) && product.product_images.length > 0) {
      return product.product_images[0];
    }

    return product.product_img || '';
  }

  changeImage(image: string) {
    this.selectedImage = image;
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

  addToCart() {
    if (!this.product_details) return;

    this.cartService.addToCart({
      ...this.product_details,
      quantity: this.quantity
    });
  }

  buyNow() {
    if (!this.product_details) return;

    this.router.navigate(['/order_products'], {
      queryParams: {
        product_id: this.product_details.id,
        quantity: this.quantity
      }
    });
  }
}
