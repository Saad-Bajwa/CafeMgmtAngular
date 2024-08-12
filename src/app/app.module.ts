import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtHelperService, JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'angular-highcharts';
import { NgxSpinnerModule} from 'ngx-spinner';

import { HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { provideHttpClient, withFetch } from '@angular/common/http';

// mat library
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';



import { AppComponent } from './app.component';
import { LoginComponent } from './login/login/login.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { CreateUserComponent } from './login/signup/create-user.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { NavbarComponent } from './ui-component/navbar/navbar.component';
import { SidebarComponent } from './ui-component/sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateComponent } from './user/create/create.component';
import { ListComponent } from './user/list/list.component';
import { CreateCategoryComponent } from './category/create/create-category.component';
import { ListCategoryComponent } from './category/list-category/list-category.component';
import { CreateProductComponent } from './product/create-product/create-product.component';
import { ListProductComponent } from './product/list-product/list-product.component';
import { CreateOrderComponent } from './order/create-order/create-order.component';
import { ViewOrdersComponent } from './order/view-orders/view-orders.component';
import { OrderPopupComponent } from './order/order-popup/order-popup.component';

export function tokenGetter() {
  return localStorage.getItem('auth-token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CreateUserComponent,
    NavbarComponent,
    SidebarComponent,
    DashboardComponent,
    CreateComponent,
    ListComponent,
    CreateCategoryComponent,
    ListCategoryComponent,
    CreateProductComponent,
    ListProductComponent,
    CreateOrderComponent,
    ViewOrdersComponent,
    OrderPopupComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatFormField,
    FormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    ChartModule,
    MatSlideToggleModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 1500,
      progressBar: true,
      preventDuplicates: true,
      closeButton: true
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['http://localhost:23687'], 
        disallowedRoutes: ['http://localhost:23687/api/user/login'] 
      }
    })
  ],
  providers: [
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
