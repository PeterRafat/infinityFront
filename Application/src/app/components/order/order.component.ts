import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Iorder } from '../../models/iorder';
import { OrderServiceService } from '../../services/order-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiProductsService } from '../../services/api-products.service';
import { IproductById } from '../../models/iproduct-by-id';
import Swal from 'sweetalert2';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  imports: [CommonModule, FormsModule,TranslateModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit, OnDestroy {
  orderData: Iorder = {
    ProductId: 0,
    Quantity: 0,
    Phone: '',
    smallSize: 'Small',
    mediumSize: 'Medium',
    largeSize: 'Large',
    xlSize: 'XL',
    xxlSize: 'XXL',
    smallQuantity: 0,
    mediumQuantity: 0,
    largeQuantity: 0,
    xlQuantity: 0,
    xllQuantity: 0,
    Address: '',
    Notes: '',
    PicsCustom: [],
    date: new Date().toISOString(),
    price: 0,
    totalPrice: 0,
    Name:'',
    Email:'',
  };

  previewUrls: string[] = [];
  productDetails: any;
  id!: number;
  data!: IproductById;
  currentLanguage: string = 'en'; // Track current language
  private langChangeSubscription!: Subscription; // Subscription for language changes

  constructor(
    private orderService: OrderServiceService,
    private router: Router,
    private service: ApiProductsService,
    private route: ActivatedRoute,
    private translate: TranslateService // Inject TranslateService
  ) {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.currentLanguage = this.translate.currentLang || 'en'; // Set initial language
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
        console.log(this.data);
      }
    });
  }

  // Get the translated product name
  getProductName(product: IproductById): string {
    return this.currentLanguage === 'ar' ? product.nameAr : product.name;
  }

  order(): void {
    const totalQuantity = this.orderData.smallQuantity +
      this.orderData.mediumQuantity +
      this.orderData.largeQuantity +
      this.orderData.xlQuantity +
      this.orderData.xllQuantity;

    const sizeDetails =
      `${this.orderData.smallSize}: ${this.orderData.smallQuantity}, ` +
      `${this.orderData.mediumSize}: ${this.orderData.mediumQuantity}, ` +
      `${this.orderData.largeSize}: ${this.orderData.largeQuantity}, ` +
      `${this.orderData.xlSize}: ${this.orderData.xlQuantity}, ` +
      `${this.orderData.xxlSize}: ${this.orderData.xllQuantity}`;

    const allPhoto = this.data.photos;

    const formData = new FormData();
    formData.append('ProductId', this.data.id.toString());
    formData.append('Name', this.orderData.Name);
    formData.append('Email', this.orderData.Email);
    formData.append('Phone', this.orderData.Phone);
    formData.append('Notes', this.orderData.Notes);
    formData.append('Quantity', totalQuantity.toString());
    formData.append('Address', this.orderData.Address);
    formData.append('size', sizeDetails);

    allPhoto.forEach((photo, index) => {
      formData.append(`PicsCustom[${index}]`, photo);
    });

    console.log(formData);
    this.orderService.postOrder(formData).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: "Order Added Successfully",
          icon: "success",
          draggable: true
        });
      },
      error: (err: any) => {
        console.log('Error submitting order', err);
        Swal.fire({
          icon: "error",
          title: `${err.message}`,
          text: "Something went wrong!",
        });
      }
    });
  }
}