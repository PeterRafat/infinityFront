import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiProductsService } from '../../services/api-products.service';
import { CommonModule } from '@angular/common';
import { IproductById } from '../../models/iproduct-by-id';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule] // Add TranslateModule here
})
export class DetailsComponent implements OnInit, OnDestroy {
    id!: number;
    data!: IproductById;
    currentLanguage: string = 'en'; // Default language
    private langChangeSubscription!: Subscription;

    constructor(
        private service: ApiProductsService,
        private route: ActivatedRoute,
        private translate: TranslateService
    ) {
        this.id = Number(this.route.snapshot.paramMap.get("id"));
        this.currentLanguage = this.translate.currentLang || 'en'; // Get current language
    }

    ngOnInit(): void {
        this.getProductDetails();

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

    getProductDetails() {
        this.service.getproductById(this.id).subscribe({
            next: (res: any) => {
                this.data = res.data;
            }
        });
    }

    changeMainImage(photo: string) {
        const mainImage = document.getElementById('mainImage') as HTMLImageElement;
        if (mainImage) {
            mainImage.src = photo;
        }
    }

    getProductName(product: IproductById): string {
        return this.currentLanguage === 'ar' ? product.nameAr : product.name;
    }
}