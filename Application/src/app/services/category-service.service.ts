import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryServiceService {

  constructor(private httpClient:HttpClient) { }
  getListOfCategory(){//selectCategory
      // console.log("testing");
      return this.httpClient.get(`${environment.baseurl2}/Api/V1/CategoryRouteGetCategoryList`)
    }
    postCategory(data:FormData){
      return this.httpClient.post(`${environment.baseurl2}/Api/V1/CategoryRoute/Create`,data)

    }
    deleteCategory(id:number)
    {
      return this.httpClient.delete(`${environment.baseurl2}/Api/V1/CategoryRoute/${id}`)
    }
}
