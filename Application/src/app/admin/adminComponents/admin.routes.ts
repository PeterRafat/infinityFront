// admin.routes.ts
import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminAllCategoryComponent } from './admin-all-category/admin-all-category.component';
import { AddNewsComponent } from './add-news/add-news.component';
import { CustomeAdminGetOrderComponent } from './custome-admin-get-order/custome-admin-get-order.component';
// import { AdminGuard } from '../guards/admin.guard'; // Import the guard

export const adminRoutes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    // canActivate: [AdminGuard] // Protect this route
  },
  {
    path: 'products',
    component: AdminProductsComponent,
    // canActivate: [AdminGuard] // Protect this route
  },
  {
    path: 'addCategory',
    component: AdminCategoryComponent ,
    // canActivate: [AdminGuard] // Protect this route
  },
  {
    path: 'Category',
    component: AdminAllCategoryComponent ,
    // canActivate: [AdminGuard] // Protect this route
  },
  {
    path:'orders' , 
    component:AdminOrdersComponent,
  },
  {
    path: 'login',
    component: AdminLoginComponent
  },
  { path: 'addProducts',
    component: AddProductComponent
  },
  { path: 'addNews',
    component: AddNewsComponent
  },
  { path: 'customeAdminOrders',
    component: CustomeAdminGetOrderComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full' // Default route
  },

];