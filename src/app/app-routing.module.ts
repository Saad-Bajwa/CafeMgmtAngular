import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { CreateUserComponent } from './login/signup/create-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateComponent } from './user/create/create.component';
import { ListComponent } from './user/list/list.component';
import { CreateCategoryComponent } from './category/create/create-category.component';
import { ListCategoryComponent } from './category/list-category/list-category.component';
import { CreateProductComponent } from './product/create-product/create-product.component';
import { ListProductComponent } from './product/list-product/list-product.component';
import { CreateOrderComponent } from './order/create-order/create-order.component';
import { ViewOrdersComponent } from './order/view-orders/view-orders.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login',component: LoginComponent},
  {path: 'signup', component: CreateUserComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'user', children: [
    { path: 'create', component: CreateComponent },
    { path: 'list', component: ListComponent },
    { path: 'create/:id', component: CreateComponent },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
  ]},
  {path: 'category', children :[
    {path: 'create', component: CreateCategoryComponent},
    {path: 'list', component: ListCategoryComponent},
    {path: 'create/:id', component: CreateCategoryComponent},
    {path: '', redirectTo: 'list', pathMatch: 'full'}
  ]},
  {path: 'product', children: [
    { path: 'create', component: CreateProductComponent},
    { path: 'list', component: ListProductComponent},
    { path: 'create/:id', component: CreateProductComponent},
    { path: '', redirectTo:'list', pathMatch: 'full'}
  ]},
  {path: 'placeOrder', component: CreateOrderComponent},
  {path: 'manageOrder', component: CreateOrderComponent},
  {path: 'viewBill', component: ViewOrdersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
