import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryServiceService } from '../../../services/category-service.service';
import Swal from 'sweetalert2';

export interface CategoryData {
    Name: string;
    NameAr:string;
    Photo: File | null;
}

@Component({
    selector: 'app-admin-category',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-category.component.html',
    styleUrl: './admin-category.component.css'
})
export class AdminCategoryComponent {
    product: CategoryData = {
        Name: '',
        NameAr:'',
        Photo: null
    };

    selectedFile: File | null = null;
    previewUrl: string | null = null;

    constructor(private categoryService: CategoryServiceService) { }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.selectedFile = file;
            this.product.Photo = file;

            // Generate preview
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.previewUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    removeImage(): void {
        this.selectedFile = null;
        this.previewUrl = null;
        this.product.Photo = null;
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();

        if (event.dataTransfer && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                this.selectedFile = file;
                this.product.Photo = file;

                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.previewUrl = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    }

    add(): void {
        if (!this.product.Photo) {
            Swal.fire({
                icon: "warning",
                title: "Please select an image",
                text: "You must upload an image before adding a category."
            });
            return;
        }

        const formData = new FormData();
        formData.append('Name', this.product.Name);
        formData.append('NameAr', this.product.NameAr);
        formData.append('Photo', this.product.Photo);

        this.categoryService.postCategory(formData).subscribe({
            next: (res: any) => {
                Swal.fire({
                    title: "Category Added Successfully",
                    icon: "success",
                    draggable: true
                });
            },
            error: (err) => {
                Swal.fire({
                    icon: "error",
                    title: `${err.message}`,
                    text: "Something went wrong!",
                });
            }
        });
    }
}
