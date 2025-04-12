import { Component, OnInit } from '@angular/core';
import { IorderAdmin } from '../../../models/iordersAdmin';
import { OrderServiceService } from '../../../services/order-service.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ApiProductsService } from '../../../services/api-products.service';
import { IproductById } from '../../../models/iproduct-by-id';
import { Iproduct } from '../../../models/iproduct';



@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: Iproduct[] = [];
  // selectedOrder: IorderAdmin | null = null; // Track the selected order
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
    // private orderService: OrderServiceService,
    private allProductService: ApiProductsService
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts(){
    this.allProductService.getAllProducts().subscribe({
      next:(res:any)=>{
        this.products=res.data;
      },
      error: (err: any) =>{
        Swal.fire({
          icon: "error",
          title: `${err.message}`,
          text: "Something went wrong!",
        });
      }
    })
  }



  deleteProduct(id: number) {
    this.allProductService.deleteProduct(id).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200 && res.succeeded) {
          this.products = this.products.filter(products => products.id !== id);
        }
        Swal.fire({
          title: "Product Deleted Successfully",
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
}