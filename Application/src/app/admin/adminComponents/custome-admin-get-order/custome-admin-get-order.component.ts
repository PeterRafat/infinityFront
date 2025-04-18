import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { OrderServiceService } from '../../../services/order-service.service';
import { IcustomeOrderAdmin } from '../../../models/custome-admin-order';

@Component({
  selector: 'app-custome-admin-get-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custome-admin-get-order.component.html',
  styleUrls: ['./custome-admin-get-order.component.css']
})
export class CustomeAdminGetOrderComponent implements OnInit {
  orders: IcustomeOrderAdmin[] = [];
  selectedOrder: IcustomeOrderAdmin = this.getEmptyOrder();
  selectedPhotoIndex: number = 0;
  showPhotoModal: boolean = false;
  isDownloadingAll: boolean = false;

  constructor(private customOrderService: OrderServiceService) {}

  ngOnInit(): void {
    this.getCustomOrders();
  }

  private getEmptyOrder(): IcustomeOrderAdmin {
    return {
  id: 0,
  name: '',
  email: '',
  phone: '',
  totalPrice: '',
  size: '',
  address: '',
  notes: '',
  date:'',
  photos: []
};
  }

  getCustomOrders() {
    this.customOrderService.getCustomeOrder().subscribe({
      next: (res: any) => {
        this.orders = res.succeeded && res.data ? res.data : [this.getEmptyOrder()];
      },
      error: (err: any) => {
        alert(err.message);
        this.orders = [this.getEmptyOrder()];
      }
    });
  }

  deleteOrder(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customOrderService.deleteCustomeOrder(id).subscribe({
          next: (res: any) => {
            if (res.statusCode === 200 && res.succeeded) {
              this.orders = this.orders.filter(order => order.id !== id);
              if (this.orders.length === 0) {
                this.orders = [this.getEmptyOrder()];
              }
              Swal.fire({
                title: "Deleted!",
                text: "Your order has been deleted.",
                icon: "success"
              });
            }
          },
          error: (err: any) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: err.message || "Failed to delete order",
            });
          }
        });
      }
    });
  }

  getOrderDetails(order: IcustomeOrderAdmin) {
    this.selectedOrder = order || this.getEmptyOrder();
  }

  showPhoto(index: number) {
    this.selectedPhotoIndex = index;
    this.showPhotoModal = true;
  }

  closePhotoModal() {
    this.showPhotoModal = false;
  }



   downloadPhoto(photoUrl: string, index: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const separator = photoUrl.includes('?') ? '&' : '?';
      const cacheBusterUrl = `${photoUrl}${separator}t=${Date.now()}`;
      
      fetch(cacheBusterUrl)
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.blob();
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = this.generatePhotoName(index);
          document.body.appendChild(a);
          a.click();
          
          // Cleanup
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            resolve();
          }, 100);
        })
        .catch(error => {
          console.error('Download error:', error);
          reject(error);
        });
    });
  }

  private generatePhotoName(index: number): string {
    const ext = this.getFileExtension(this.selectedOrder.photos[index]);
    return `order-${this.selectedOrder.id}-${index + 1}.${ext}`;
  }

  private getFileExtension(url: string): string {
    const parts = url.split('.');
    return parts[parts.length - 1].split('?')[0].split('#')[0];
  }

  navigatePhoto(direction: 'prev' | 'next') {
    if (!this.selectedOrder.photos) return;
    
    if (direction === 'prev') {
      this.selectedPhotoIndex = (this.selectedPhotoIndex - 1 + this.selectedOrder.photos.length) % this.selectedOrder.photos.length;
    } else {
      this.selectedPhotoIndex = (this.selectedPhotoIndex + 1) % this.selectedOrder.photos.length;
    }
  }
}