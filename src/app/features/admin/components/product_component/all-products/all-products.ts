import { Component } from '@angular/core';
import { Products } from '../../../../../core/services/products';
import { Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../../core/models/product';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-all-products',
  imports: [FormsModule,CommonModule],
  templateUrl: './all-products.html',
  styleUrl: './all-products.css',
})
export class AllProducts {
  products: Product[] = [];
searchTerm: string = '';

constructor(private productService:Products, private router: Router , private cdr: ChangeDetectorRef) {}
ngOnInit() {
  this.getProducts();

}

getProducts() {
  this.productService.getProducts().subscribe({
    next: (res) => {
      this.products = res;
        this.cdr.detectChanges();
    },
   
    error: (err) => {
      console.error(err);
      
    }
  });
}

editProduct(id: number) {
  this.router.navigate(['/admin/products/update', id]);
}

deleteProduct(id: number) {
  if (confirm('Are you sure you want to delete this product?')) {

    this.productService.deleteProduct(id).subscribe({
      next: () => {

        
          // ✅ Instant UI update
        this.products = this.products.filter(p => p.id !== id);

        // 🔄 Optional background sync (no flicker)
        setTimeout(() => this.getProducts(), 500);

      },
      error: (err) => {
        console.error(err);
      }
    });

  }
}
}
