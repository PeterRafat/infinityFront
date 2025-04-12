import { Routes } from '@angular/router';
import { ContactusComponent } from './components/contactus/contactus.component';
import { DesignComponent } from './components/design/design.component';

import { AboutusComponent } from './components/aboutus/aboutus.component';
import { OrderComponent } from './components/order/order.component';
import { ProductsComponent } from './components/products/products.component';
import { DetailsComponent } from './components/details/details.component';
import { HomePageComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductByCategoryComponent } from './components/product-by-category/product-by-category.component';
import { CustomOrderComponent } from './components/custom-order/custom-order.component';
import { NewsComponent } from './components/news/news.component';
import { NewsDetailsComponent } from './components/news-details/news-details.component';

export const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./admin/adminComponents/admin.routes').then(m => m.adminRoutes)
    },
    { path: "home", component: HomePageComponent },
    { path: "contactus", component: ContactusComponent },
    { path: "productByCategory/:id", component: ProductByCategoryComponent },
    { path: "design", component: DesignComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'details/:id', component: DetailsComponent },
    { path: 'aboutus', component: AboutusComponent },
    { path: 'order/:id', component: OrderComponent },
    { path: 'customeOrder', component: CustomOrderComponent },
    { path: 'news', component: NewsComponent },
    { path: 'newsDetails/:id', component: NewsDetailsComponent },
    {path: '', redirectTo: 'home',pathMatch: 'full' },// Default route 
];
