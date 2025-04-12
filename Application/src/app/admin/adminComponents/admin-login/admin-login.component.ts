import { Component } from '@angular/core';
import { LoginAdminServiceService } from '../../../services/login-admin-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { adminData } from '../../../models/ilogin';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  data: adminData = {
    UserName: '',
    Password: ''
  }
  constructor(private loginService: LoginAdminServiceService) { }
  login() {
    const formData = new FormData();
    formData.append('UserName', this.data.UserName);
    formData.append('Password', this.data.Password);
    // const formData = {
    //   UserName: this.data.UserName,
    //   Password: this.data.Password
    // };
    console.log(this.data);
    this.loginService.postLogin(formData).subscribe({
      next: (res) => {
        // console.log(res)
        Swal.fire({
          title: "Login Successful",
          icon: "success",
          draggable: true
        });
      },
      error: (err) => {
        // console.log(err)
        Swal.fire({
          icon: "error",
          title: `${err.message}`,
          text: "Something went wrong!",
        });
      }
    })

  }
}
