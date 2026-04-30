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
currentPage: number = 1;
totalPages: number = 10
perPage: number = 10;

isSearching: boolean = false;

constructor(private productService:Products, private router: Router , private cdr: ChangeDetectorRef) {}
ngOnInit() {
 // this.getProducts();
  this.loadProducts();

}

loadProducts() {
  this.isSearching = false;

  this.productService
    .getProductsPaginated(Number(this.currentPage), Number(this.perPage))
    .subscribe({
      next: (res) => {
        console.log(res);

         this.products = res.products;
        this.totalPages = res.total_pages;
        this.currentPage = res.current_page; 

        console.log('Total Pages:', this.totalPages);
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
}


onSearch() {
  if (!this.searchTerm.trim()) {
    this.loadProducts();
    return;
  }

  this.isSearching = true;

  this.productService.searchProducts(this.searchTerm).subscribe({
    next: (res) => {
      this.products = res;
      this.cdr.detectChanges();
    },
    error: (err) => console.error(err)
  });
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.loadProducts();
    this
  }
}


prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.loadProducts();
    this.cdr.detectChanges();
  }
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
