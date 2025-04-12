import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Icategory } from '../../../models/icategory';
import { CategoryServiceService } from '../../../services/category-service.service';
import { ApiProductsService } from '../../../services/api-products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-all-category',
  imports: [CommonModule],
  templateUrl: './admin-all-category.component.html',
  styleUrl: './admin-all-category.component.css'
})
export class AdminAllCategoryComponent {
  categories: Icategory[] = [];
  // selectedOrder: IorderAdmin | null = null; // Track the selected order
  // details: IproductById = {
  //   id: 0,
  //   name: '',
  //   price: 0,
  //   photos: [],
  //   description: '',
  //   categoryName: ''
  // };

  constructor(
    // private orderService: OrderServiceService,
    private allCategoryService: CategoryServiceService,
    private servieCategory: ApiProductsService
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }
  getCategories(): void {
    this.servieCategory.getAllCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
      },
      error: (err) => {
        alert(err);
      }
    });
  }

  deleteCategoryById(id: number) {
    this.allCategoryService.deleteCategory(id).subscribe({
      next: (res: any) => {
        if (res.statusCode === 200 && res.succeeded) {
          this.categories = this.categories.filter(categories => categories.id !== id);
        }
        Swal.fire({
          title: "Category Deleted Successfully",
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
