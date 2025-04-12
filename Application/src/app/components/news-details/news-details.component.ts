import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NewsServiceService } from '../../services/news-service.service';
import { inewsById } from '../../models/inewsById';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.css']
})
export class NewsDetailsComponent implements OnInit {
  newsItem!: inewsById;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsServiceService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadNewsDetails(+id);
    } else {
      this.error = 'No news ID provided';
      this.loading = false;
    }
  }

  loadNewsDetails(id: number): void {
    this.newsService.getNewsById(id).subscribe({
      next: (response:any) => {
        if (response.succeeded && response.data) {
          this.newsItem = response.data;
        } else {
          this.error = 'News item not found';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading news details:', err);
        this.error = 'Failed to load news details';
        this.loading = false;
      }
    });
  }
}