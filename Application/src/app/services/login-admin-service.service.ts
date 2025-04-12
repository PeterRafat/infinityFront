import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { adminData } from '../models/ilogin';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginAdminServiceService {
  
  constructor(private httpClient:HttpClient) { }
  postLogin(data:FormData): Observable<any>{
    return this.httpClient.post(`${environment.baseurl2}/Api/V1/Authentication/SignIn`,data)
  }
}
