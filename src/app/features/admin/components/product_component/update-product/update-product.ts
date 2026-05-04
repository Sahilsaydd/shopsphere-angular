import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
   product_img?: string;   
  product_images?: string[]; 

};
@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-product.html',
  styleUrl: './update-product.css',
})
export class UpdateProduct implements OnInit {
  imageBaseUrl = 'http://127.0.0.1:8000';


  productId!: number;
  product: ProductForm ={
    name:"",
    description:"",
    price:null,
    category:"",
    rating:0,
    stock:0,
    brand:"",
    discount_percentage:0,
    product_img:" ",
    product_images:[]
  }

  selectedFile: File | null = null;
  selectedFiles: File[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: Products,
    private cdr:ChangeDetectorRef

  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/admin/product/all']);
      return;
    }

    this.productId = Number(id);
    this.loadProduct();
  }

  loadProduct() {
    this.productService.getProductById(this.productId).subscribe({
      next: (res) => {
        this.product = {
          name: res.name,
          description: res.description,
          price: res.price,
          category: res.category,
          rating: res.rating,
          stock: res.stock,
          brand: res.brand,
          discount_percentage: res.discount_percentage,
          product_img: res.product_img,
          product_images: res.product_images || []

        };
        console.log(this.product)
        this.cdr.detectChanges()
      },
      error: (err: unknown) => console.error(err),
    });
  }

 onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

   onMultipleSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = input.files ? Array.from(input.files) : [];
  }

  update(){
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

    this.productService.updateProduct(this.productId,formData).subscribe({
      next: (res) => {
        console.log('Product updated:', res);
        alert('Product updated successfully.');
        this.router.navigate(['/admin/product/all']);
      },
      error: (err:unknown) => {
        console.error('Error updating product:', err);
        alert('Failed to update product.');
      }
    });

}

goBack(){
  this.router.navigate(['/admin/product/all']);
}

resolveImage(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('assets/')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${this.imageBaseUrl}${normalizedPath}`;
}
}
