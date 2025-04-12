import { Component, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiProductsService } from '../../services/api-products.service';
import { RouterLink } from '@angular/router';
import { Icategory } from '../../models/icategory';
import { CategoryServiceService } from '../../services/category-service.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Iproduct } from '../../models/iproduct';

declare var bootstrap: any;

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomePageComponent implements AfterViewInit {
  products: Iproduct[] = [];
  categories: Icategory[] = [];
  loading: boolean = false;
  currentLanguage: string = 'en'; // Default language
  scrolledAmount: number = 0;

  constructor(
    private serviceProducts: ApiProductsService,
    private serviceCategory: CategoryServiceService,
    private translate: TranslateService
  ) {
    this.currentLanguage = this.translate.currentLang || 'en'; // Get current language
  }

  ngOnInit(): void {
    this.getProducts();
    this.getCategory();
    this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage = event.lang;
    });
  }

  ngAfterViewInit(): void {
    // Initialize tooltips for action buttons
    const tooltipTriggerList = document.querySelectorAll('[title]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Initialize carousel
    const carouselElement = document.querySelector('#carouselExampleIndicators');
    if (carouselElement) {
      const carousel = new bootstrap.Carousel(carouselElement, {
        interval: 5000,
        wrap: true,
        touch: true
      });
    }
    
    // Initialize scroll animations
    this.initScrollAnimation();
    
    // Initialize counters
    this.initCounters();
    
    // Initialize back to top button
    this.handleBackToTop();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrolledAmount = window.scrollY;
    this.handleScrollAnimations();
    this.handleBackToTop();
  }
  
  getProducts() {
    this.loading = true;
    this.serviceProducts.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res.data.slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert(err);
      }
    });
  }

  getCategory() {
    this.serviceCategory.getListOfCategory().subscribe({
      next: (res: any) => {
        this.categories = res.data;
      },
      error: (err) => {
        this.loading = false;
        alert(err);
      }
    });
  }

  getCategoryName(category: Icategory): string {
    return this.currentLanguage === 'ar' ? category.nameAr : category.name;
  }
  
  getProductName(product: Iproduct): string {
    return this.currentLanguage === 'ar' ? product.nameAr : product.name;
  }
  
  // Scroll animations
  initScrollAnimation() {
    const animateElements = document.querySelectorAll('.reveal-on-scroll');
    this.handleScrollAnimations();
  }
  
  handleScrollAnimations() {
    const animateElements = document.querySelectorAll('.reveal-on-scroll');
    
    animateElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 100) {
        const animation = element.getAttribute('data-animation') || 'animate__fadeIn';
        const delay = element.getAttribute('data-delay') || '0';
        
        setTimeout(() => {
          element.classList.add('animate__animated', animation);
          element.classList.remove('reveal-on-scroll');
        }, parseInt(delay));
      }
    });
  }
  
  // Counter animation
  initCounters() {
    const counters = document.querySelectorAll('.count');
    
    counters.forEach(counter => {
      const target = +(counter.getAttribute('data-target') || '0');
      const isDecimal = target.toString().includes('.');
      
      const updateCounter = () => {
        const windowHeight = window.innerHeight;
        const elementTop = counter.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 100) {
          let duration = 2000;
          let frameRate = 1000 / 60;
          let frames = duration / frameRate;
          let increment = target / frames;
          
          const animate = (currentValue: number) => {
            if (currentValue < target) {
              if (isDecimal) {
                counter.textContent = currentValue.toFixed(1);
              } else {
                counter.textContent = Math.floor(currentValue).toString();
              }
              
              let nextValue = currentValue + increment;
              
              if (nextValue > target) {
                nextValue = target;
              }
              
              setTimeout(() => animate(nextValue), frameRate);
            } else {
              if (isDecimal) {
                counter.textContent = target.toFixed(1);
              } else {
                counter.textContent = target.toString();
              }
            }
          };
          
          animate(0);
          
          // Remove event listener once animation starts
          window.removeEventListener('scroll', updateCounter);
        }
      };
      
      window.addEventListener('scroll', updateCounter);
      // Also check on load
      updateCounter();
    });
  }
  
  // Back to top functionality
  handleBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
      if (this.scrolledAmount > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
      
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
}