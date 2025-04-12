import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
// import { Iproduct } from '../models/iproduct';
interface ProductData {
  Name: string;
  Description: string;
  Price: string;
  Catid: string;
  Photos: File[];
}
@Injectable({
  providedIn: 'root'
})
export class ApiProductsService {

  constructor(private httpClient: HttpClient) { }
  getAllProducts() {//products
    return this.httpClient.get(`${environment.baseurl2}/Api/V1/ProductRouteGetProductList`)
  }
  getAllCategories() {//Categories
    return this.httpClient.get(`${environment.baseurl2}/Api/V1/CategoryRouteGetCategoryList`)
  }
  getProductByCategories(id: number) {
    return this.httpClient.get(`${environment.baseurl2}/Api/V1/ProductRouteCategory/${id}`);
  }
  getproductById(id: number) {//Product Details
    return this.httpClient.get(`${environment.baseurl2}/Api/V1/ProductRoute/${id}`)
  }
  AddProduct(product: FormData): Observable<any> {
    console.log('Sending product data:', product);
    const headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' }); // <-- Debug here
    return this.httpClient.post(
      `${environment.baseurl2}/Api/V1/ProductRoute/Create`,
      product
    );
  }
  deleteProduct(id:number)
  {
    return this.httpClient.delete(`${environment.baseurl2}/Api/V1/ProductRoute/${id}`)
  }
}
