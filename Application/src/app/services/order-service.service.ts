import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Iorder } from '../models/iorder';

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {

  constructor(private httpClient: HttpClient) { }

  postOrder(orderData: FormData) {
    return this.httpClient.post(`${environment.baseurl2}/Api/V1/OrderRoute/Create`, orderData);
  }
  postCustomeOrder(orderData: FormData) {
    return this.httpClient.post(`${environment.baseurl2}/Api/V1/CustomOrders/Create`, orderData);
  }
  getAllOrders(){
    return this.httpClient.get(`${environment.baseurl2}/Api/V1/OrderRouteGetOrdersList`)
  }
  deleteOrder(id:number)
  {
    return this.httpClient.delete(`${environment.baseurl2}/Api/V1/OrderRoute/${id}`)
  }
  getCustomeOrder(){
    return this.httpClient.get(`${environment.baseurl2}/Api/V1/CustomOrdersGetCustomOrderList`)
  }
  deleteCustomeOrder(id:number)
  {
    return this.httpClient.delete(`${environment.baseurl2}/Api/V1/CustomOrders/${id}`)
  }
  getCustomeOrderById(id:number)
  {
    return this.httpClient.get(`${environment.baseurl2}/Api/V1/CustomOrders/${id}`)
  }
}