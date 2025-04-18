import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { OrderServiceService } from '../../services/order-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { IcustomeOrder } from '../../models/icustomeOrder';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CustomTotalPriceService } from '../../services/custome-total-price.service';

@Component({
  selector: 'app-custom-order',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './custom-order.component.html',
  styleUrls: ['./custom-order.component.css']
})
export class CustomOrderComponent implements OnInit {
  orderData: IcustomeOrder = {
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
    Photo: [],
    date: new Date().toISOString(),
    price: 0,
    totalPrice: 0,
    Name: '',
    Email: ''
  };

  previewUrls: string[] = [];

  constructor(
    private orderService: OrderServiceService,
    private router: Router,
    private translate: TranslateService,
    private totalPriceService:CustomTotalPriceService
  ) {
    this.translate.setDefaultLang('en'); // Set default language
  }

  ngOnInit(): void {
    this.totalPriceService.currentTotalPrice.subscribe(price => {
      this.orderData.price = price;
      this.calculateTotalPrice();
    });
  }
  // Add this method
  calculateTotalPrice(): void {
    // Calculate total quantity
    const totalQuantity = 
      this.orderData.smallQuantity + 
      this.orderData.mediumQuantity + 
      this.orderData.largeQuantity + 
      this.orderData.xlQuantity + 
      this.orderData.xllQuantity;
  
    // Calculate total price (price per shirt * total quantity)
    this.orderData.totalPrice = this.orderData.price * totalQuantity;
    
    // Update the Quantity field (if needed)
    this.orderData.Quantity = totalQuantity;
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  // Handle files
  handleFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        this.orderData.Photo.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('CUSTOM_ORDER.ERRORS.INVALID_FILE_TYPE'),
          text: this.translate.instant('CUSTOM_ORDER.ERRORS.INVALID_FILE_TYPE_DETAIL'),
        });
      }
    }
  }

  // Remove an image
  removeImage(index: number): void {
    this.orderData.Photo.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  // Handle form submission
  order(): void {
    const sizeDetails =
      `${this.orderData.smallSize}: ${this.orderData.smallQuantity}, ` +
      `${this.orderData.mediumSize}: ${this.orderData.mediumQuantity}, ` +
      `${this.orderData.largeSize}: ${this.orderData.largeQuantity}, ` +
      `${this.orderData.xlSize}: ${this.orderData.xlQuantity}, ` +
      `${this.orderData.xxlSize}: ${this.orderData.xllQuantity}`;

    const formData = new FormData();
    formData.append('Name', this.orderData.Name);
    formData.append('Email', this.orderData.Email);
    formData.append('Size', sizeDetails);
    formData.append('Notes', this.orderData.Notes);
    formData.append('Address', this.orderData.Address);
    formData.append('Phone', this.orderData.Phone);
    formData.append('TotalPrice', this.orderData.totalPrice.toString());

    this.orderData.Photo.forEach((file) => {
      formData.append('Photos', file);
    });

    // Log FormData for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    this.orderService.postCustomeOrder(formData).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: this.translate.instant('CUSTOM_ORDER.SUCCESS.ORDER_ADDED'),
          icon: 'success',
          draggable: true
        });
      },
      error: (err: any) => {
        console.log('Error submitting order', err);
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('CUSTOM_ORDER.ERRORS.SOMETHING_WENT_WRONG'),
          text: err.message,
        });
      }
    });
  }

  // Switch language
  switchLanguage(language: string) {
    this.translate.use(language);
  }
}