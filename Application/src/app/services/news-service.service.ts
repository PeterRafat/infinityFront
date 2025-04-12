import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsServiceService {
  constructor(private http: HttpClient) { }

  getAllNews() {
    return this.http.get(`${environment.baseurl2}/Api/V1/NewsRouteGetNewsList`);
  }

  getNewsById(id: number){
    return this.http.get(`${environment.baseurl2}/Api/V1/NewsRoute/${id}`);
  }
  postNews(newsData:FormData){
    return this.http.post(`${environment.baseurl2}/Api/V1/NewsRoute/Create`,newsData)
  }
  getNews(){
    return this.http.get(`${environment.baseurl2}/Api/V1/NewsRouteGetNewsList`)
  }
  deleteNews(id:number){
    return this.http.delete(`${environment.baseurl2}/Api/V1/NewsRoute/${id}`)
  }
}