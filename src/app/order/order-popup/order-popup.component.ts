import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Interface } from 'readline';

export interface ProDetails{
  category: string;
  product: string;
  price: number;
  quantity: number;
  total: number;
};

@Component({
  selector: 'app-order-popup',
  templateUrl: './order-popup.component.html',
  styleUrl: './order-popup.component.css'
})
export class OrderPopupComponent {
  
  displayedColumns: string[] = ['category', 'product', 'price', 'quantity', 'total'];
  dataSource = new MatTableDataSource<ProDetails>(); 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    let parsedProductsDetails : ProDetails[] = [];
    if(typeof data.productDetails === 'string'){
      try {
        parsedProductsDetails = JSON.parse(data.productDetails);
        console.log('Parsed Product Details:', parsedProductsDetails);
      } catch (error) {
        console.error('Error parsing productDetails:', error);
      }
    }
    else if (Array.isArray(data.productDetails)) {
      parsedProductsDetails = data.productDetails;
    } else {
      console.warn('productDetails is neither a string nor an array.', data.productDetails);
    }
    this.dataSource.data = parsedProductsDetails;
  }
}
