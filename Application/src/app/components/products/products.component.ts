import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiProductsService } from '../../services/api-products.service';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from "../spinner/spinner.component";
import { RouterLink } from '@angular/router';
import { Iproduct } from '../../models/iproduct';
import { Icategory } from '../../models/icategory';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, RouterLink, TranslateModule,TranslatePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Iproduct[] = [];
  categories: Icategory[] = [];
  loading: boolean = false;
  selectedCategory: number = -1; // Default to "All"
  showProducts: boolean[] = []; // Controls the animation state of each card
  currentLanguage: string = 'en'; // Default language
  private langChangeSubscription!: Subscription; // Subscription for language changes

  constructor(private service: ApiProductsService, private translate: TranslateService) {
    this.currentLanguage = this.translate.currentLang || 'en'; // Get current language
  }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();

    // Subscribe to language changes
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage = event.lang; // Update current language
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  getProducts(): void {
    this.loading = true;
    this.products = [];
    this.showProducts = [];

    this.service.getAllProducts().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.products = res.data;
        this.triggerAnimation();
      },
      error: (err) => {
        this.loading = false;
        alert(err);
      }
    });
  }

  getCategories(): void {
    this.loading = true;
    this.service.getAllCategories().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.categories = res.data;
      },
      error: (err) => {
        this.loading = false;
        alert(err);
      }
    });
  }

  filterCategories(event: any): void {
    const value = event.target.value;
    if (value === "-1") {
      this.getProducts();
    } else {
      this.getSpecifcCategories(Number(value));
    }
  }

  filterByCategory(categoryId: number): void {
    this.selectedCategory = categoryId;
    this.products = [];
    this.showProducts = [];

    if (categoryId === -1) {
      this.getProducts();
    } else {
      this.getSpecifcCategories(categoryId);
    }
  }

  getSpecifcCategories(categoryId: number): void {
    this.loading = true;
    this.products = [];
    this.showProducts = [];

    this.service.getProductByCategories(categoryId).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.products = res.data;
        this.triggerAnimation();
      },
      error: (err) => {
        this.loading = false;
        alert(err);
      }
    });
  }

  triggerAnimation(): void {
    this.products.forEach((_, index) => {
      setTimeout(() => {
        this.showProducts[index] = true;
      }, index * 200); // Delay each card by 200ms
    });
  }

  // Get the translated product name
  getProductName(product: Iproduct): string {
    return this.currentLanguage === 'ar' ? product.nameAr : product.name;
  }

  // Get the translated category name
  getCategoryName(category: Icategory): string {
    return this.currentLanguage === 'ar' ? category.nameAr : category.name;
  }
}