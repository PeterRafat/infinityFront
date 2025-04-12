import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { NewsServiceService } from '../../services/news-service.service';
import { Inews } from '../../models/inews';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  news: Inews[] = [];
  loading = true;

  constructor(private newsService: NewsServiceService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.newsService.getAllNews().subscribe({
      next: (response:any) => {
        if (response.succeeded && response.data) {
          this.news = response.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading news:', err);
        this.loading = false;
      }
    });
  }

  truncateContent(content: string): string {
    const words = content.split(' ');
    return words.length > 10 ? words.slice(0, 10).join(' ') + '...' : content;
  }
}