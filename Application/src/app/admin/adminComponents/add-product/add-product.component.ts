// add-product.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryServiceService } from '../../../services/category-service.service';
import { ApiProductsService } from '../../../services/api-products.service';
import Swal from 'sweetalert2';

interface ProductData {
  Name: string;
  NameAr:string;
  Description: string;
  Price: string;
  Catid:string;
  Photos: File[];
}
interface category{
  id:number;
  name:string;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  categoryList!:category[];
  product: ProductData = {
    Name: '',
    NameAr:'',
    Description: '',
    Price: '',
    Catid: '',
    Photos: []
  };
  constructor(private categoryservice:CategoryServiceService,private productservice:ApiProductsService){
    
  }
  ngOnInit(): void {
    // console.log("init0");
    this.getlistCategory();
  }
  getlistCategory(){
    //console.log("in");
    this.categoryservice.getListOfCategory().subscribe(
      {
        
        next:(res:any)=> 
          {
            this.categoryList = res.data
            console.log(this.categoryList);
          },  
        error:(err)=>
        {
            
            alert(err)
        }
      }
    );
  }


 

  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
        this.product.Photos.push(files[i]);
        
        // Create preview for the image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.product.Photos.splice(index, 1);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer && event.dataTransfer.files) {
      const files = event.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          this.selectedFiles.push(files[i]);
          this.product.Photos.push(files[i]);
          
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.previewUrls.push(e.target.result);
          };
          reader.readAsDataURL(files[i]);
        }
      }
    }
  }

  add(): void {
    console.log('Submitted product data:', this.product);
    // Here you would typically send the data to your backend
    // Reset form after submission if needed
    console.log(this.product);

    const formData = new FormData();
    formData.append('Name', this.product.Name);
    formData.append('NameAr', this.product.NameAr);
    formData.append('Description', this.product.Description);
    formData.append('Price', this.product.Price);
    if (this.product.Photos && this.product.Photos.length > 0) {
      for (let i = 0; i < this.product.Photos.length; i++) {
        formData.append('Photos', this.product.Photos[i], this.product.Photos[i].name); // Append each file individually
      }
    }
    formData.append('Catid', this.product.Catid);
    this.productservice.AddProduct(formData).subscribe({
        
      next:(res:any)=> 
        {
          Swal.fire({
            title: "Product Added Successful",
            icon: "success",
            draggable: true
          });
        },  
      error:(err)=>
      {
          // console.log(this.product);
          Swal.fire({
            icon: "error",
            title: `${err.message}`,
            text: "Something went wrong!",
          });
      }
    });
  }
}