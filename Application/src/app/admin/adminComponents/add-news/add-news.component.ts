import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NewsServiceService } from '../../../services/news-service.service';

@Component({
  selector: 'app-add-news',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent implements OnInit {
  newsForm: FormGroup;
  newsList: any[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  isLoading = false;
  showForm = true;

  constructor(
    private fb: FormBuilder,
    private newsService: NewsServiceService
  ) {
    this.newsForm = this.fb.group({
      arabicTitle: ['', [Validators.required, Validators.maxLength(200)]],
      englishTitle: ['', [Validators.required, Validators.maxLength(200)]],
      arabicDetails: ['', [Validators.required]],
      englishDetails: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews() {
    this.isLoading = true;
    this.newsService.getNews().subscribe({
      next: (res: any) => {
        this.newsList = res.data || res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load news', 'error');
      }
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    // Reset file input
    const fileInput = document.getElementById('newsImage') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit() {
    if (this.newsForm.valid) {
      this.isSubmitting = true;
      const formData = new FormData();

      // Append form data with correct field names (match your API expectations)
      formData.append('TitleAr', this.newsForm.get('arabicTitle')?.value);
      formData.append('Title', this.newsForm.get('englishTitle')?.value);
      formData.append('ContentAr', this.newsForm.get('arabicDetails')?.value);
      formData.append('Content', this.newsForm.get('englishDetails')?.value);

      
      // Append image if exists
      if (this.selectedImage) {
        formData.append('Photo', this.selectedImage, this.selectedImage.name);
      }
      
      for (let [key, value] of (formData as any).entries()) {
        console.log(key, value);
      }
      this.newsService.postNews(formData).subscribe({
        next: (res) => {
          console.log("peter");
          Swal.fire({
            title: 'Success!',
            text: 'News added successfully',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          this.resetForm();
          this.loadNews(); // Refresh the news list
          this.showForm = false; // Switch to list view
        },
        error: (err) => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add news. Please try again.',
          });
          console.error('Error submitting form:', err);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormAsTouched();
    }
  }

  deleteNews(id: number) {
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
        this.newsService.deleteNews(id).subscribe({
          next: () => {
            this.newsList = this.newsList.filter(news => news.id !== id);
            Swal.fire('Deleted!', 'News has been deleted.', 'success');
          },
          error: (err) => {
            Swal.fire('Error', 'Delete failed', 'error');
            console.error('Error deleting news:', err);
          }
        });
      }
    });
  }

  resetForm() {
    this.newsForm.reset();
    this.removeImage();
    this.isSubmitting = false;
  }

  private markFormAsTouched() {
    Object.keys(this.newsForm.controls).forEach(field => {
      const control = this.newsForm.get(field);
      control?.markAsTouched();
    });
  }

  toggleView() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.loadNews();
  }
}