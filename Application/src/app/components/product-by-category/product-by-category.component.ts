import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from "../spinner/spinner.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IproductById } from '../../models/iproduct-by-id';
import { Iproduct } from '../../models/iproduct';
import { Icategory } from '../../models/icategory';
import { ApiProductsService } from '../../services/api-products.service';
import { CategoryServiceService } from '../../services/category-service.service';

@Component({
  selector: 'app-product-by-category',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-by-category.component.html',
  styleUrl: './product-by-category.component.css'
})
export class ProductByCategoryComponent implements OnInit {
  products: Iproduct[] = [];
  categories: Icategory[] = [];
  categoryId: number = 0;
  categoryName:string='';
  constructor(  private route: ActivatedRoute, private productServiceByCategoryId:ApiProductsService ,private serviceCategory:CategoryServiceService ){
  }
  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProductById();
    this.getCategory();
  }
  getProductById(){
    this.productServiceByCategoryId.getProductByCategories(this.categoryId).subscribe({
      next:(res:any)=>{
        this.products=res.data;
      }
    })
  }
  getCategory(){
    this.serviceCategory.getListOfCategory().subscribe({
      next:(res:any)=>{
        this.categories=res.data;
        const category = this.categories.find((cat) => cat.id === this.categoryId);
        this.categoryName = category ? category.name : 'Unknown Category';
      },
      error: (err) => {
        alert(err)
      }
    })
  }

}
