import { Component, OnInit } from '@angular/core';
import { IorderAdmin } from '../../../models/iordersAdmin';
import { OrderServiceService } from '../../../services/order-service.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ApiProductsService } from '../../../services/api-products.service';
import { IproductById } from '../../../models/iproduct-by-id';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: IorderAdmin[] = [];
  selectedOrder: IorderAdmin | null = null; // Track the selected order
  details: IproductById = {
    id: 0,
    name: '',
    nameAr:'',
    price: 0,
    photos: [],
    description: '',
    categoryName: ''
  };

  constructor(
    private orderService: OrderServiceService,
    private productDetailsService: ApiProductsService
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (res: any) => {
        this.orders = res.data;
      },
      error: (err: any) => {
        alert(err.message);
      }
    });
  }

  deleteOrder(id: number) {
    this.orderService.deleteOrder(id).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200 && res.succeeded) {
          this.orders = this.orders.filter(order => order.id !== id);
        }
        Swal.fire({
          title: "Order Deleted Successfully",
          icon: "success",
          draggable: true
        });
      },
      error: (err: any) => {
        Swal.fire({
          icon: "error",
          title: `${err.message}`,
          text: "Something went wrong!",
        });
      }
    });
  }

  getDetails(productId: number, order: IorderAdmin) {
    this.selectedOrder = order; // Store the selected order
    this.productDetailsService.getproductById(productId).subscribe({
      next: (res: any) => {
        this.details = res.data;
      },
      error: (err: any) => {
        alert(`${err.message}`);
      }
    });
  }
}
