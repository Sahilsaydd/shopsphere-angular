import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../core/models/product';
import { CategoryService } from '../../core/services/categories';
import { Products } from '../../core/services/products';

interface DisplayCategory {
  name: string;
  desc: string;
  image: string;
  productCount: number;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent implements OnInit {

  categories: DisplayCategory[] = [];
  loading = true;

  constructor(
    private categoryService: CategoryService,
    private productsService: Products,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loading = true;

    // ✅ FIRST get products
    this.productsService.getProducts().subscribe({
      next: (products) => {

        // ✅ THEN get category meta
        this.categoryService.getCategories().subscribe({
          next: (categoryMeta) => {

            const distinctNames = Array.from(
              new Set(products.map(p => p.category).filter(Boolean))
            );

            this.categories = distinctNames.slice(0, 4).map((name, index) => {

              const meta = categoryMeta.find(
                item => item.name.toLowerCase() === name.toLowerCase()
              );

              return {
                name,
                desc: meta?.desc ?? `Discover the best ${name} picks`,
                image: meta?.image
                  ?? (categoryMeta.length
                    ? categoryMeta[index % categoryMeta.length].image
                    : 'assets/images/categories/living.jpg'),
                productCount: products.filter(p => p.category === name).length
              };
            });

            this.loading = false; // ✅ SUCCESS
          },

          error: (err) => {
            console.error('Category API failed:', err);

            // 🔥 FALLBACK → still show categories from products
            const distinctNames = Array.from(
              new Set(products.map(p => p.category).filter(Boolean))
            );

            this.categories = distinctNames.slice(0, 4).map(name => ({
              name,
              desc: `Explore ${name}`,
              image: 'assets/images/categories/living.jpg',
              productCount: products.filter(p => p.category === name).length
            }));

            this.loading = false;
          }
        });
      },

      error: (err) => {
        console.error('Products API failed:', err);
        this.loading = false;
      }
    });
  }

  goToCategory(categoryName: string) {
    this.router.navigate(['/shop'], {
      queryParams: { category: categoryName }
    });
  }
}