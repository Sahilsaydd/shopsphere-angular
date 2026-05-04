import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Products } from '../../../../../core/services/products';

type ProductForm = {
  name: string;
  description: string;
  price: number | null;
  category: string;
  rating: number | null;
  stock: number | null;
  brand: string;
  discount_percentage: number | null;
};

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  product: ProductForm = {
    name: '',
    description: '',
    price: null,
    category: '',
    rating: 0,
    stock: 0,
    brand: '',
    discount_percentage: 0,
  };

  selectedFile: File | null = null;
  selectedFiles: File[] = [];
  isSubmitting = false;

  constructor(private productService: Products) {}

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  onMultipleSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = input.files ? Array.from(input.files) : [];
  }

  confirmCreate() {
    this.closeConfirmModal();
    this.createProduct();
  }

  createProduct() {
    if (!this.product.name || !this.product.price) {
      alert('Please fill in the required fields.');
      return;
    }

    const formData = new FormData();

    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('price', String(this.product.price));
    formData.append('category', this.product.category);
    formData.append('stock', String(this.product.stock ?? 0));
    formData.append('rating', String(this.product.rating ?? 0));
    formData.append('brand', this.product.brand || '');
    formData.append('discount_percentage', String(this.product.discount_percentage ?? 0));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    this.isSubmitting = true;

    this.productService.createProduct(formData).subscribe({
      next: (res) => {
        console.log('Product created:', res);
        this.resetForm();
        this.isSubmitting = false;
        alert('Product created successfully.');
      },
      error: (err) => {
        console.error('Error:', err);
        this.isSubmitting = false;
        alert('Something went wrong.');
      },
    });
  }

  openConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
      bootstrapModal?.hide();
    }
  }

  private resetForm() {
    this.product = {
      name: '',
      description: '',
      price: null,
      category: '',
      rating: 0,
      stock: 0,
      brand: '',
      discount_percentage: 0,
    };

    this.selectedFile = null;
    this.selectedFiles = [];
  }
}
