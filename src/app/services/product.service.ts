import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//import {  ProductWrapper, product } from '../data-type';
import { environment } from 'src/environments/environment';
import { Observable, catchError } from 'rxjs';
import { AlertMessage, CartHold, Category, Customer, ProductView, ProductWrapper, Product, ApiResponse } from '../model/model-classes.model';
import { Errors } from '../errors/errors';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private myUrl = environment.apiUrl  ; 
  private cloudApiUrl = environment.cloudAPIUrl;

  //cartData= new EventEmitter<Product[] | []>();


  constructor(private http:HttpClient) { }

  errors: Errors = new Errors();

  addProduct(data:Product){

    //let myUrl = `${this.myUrl}` + `products/${id}`  ;

    return this.http.post('http:localhost:3000/product', data)
  }
  getProduct(id: any) {
    let myUrl = `${this.myUrl}` + `products/${id}`  ;

    return this.http.get<Product>(myUrl);

  }

  /************************************* */
  // clearCart() {
  //   let cartData = [];
  //   let localCart = localStorage.getItem('localCart');
  //   if (!localCart){
  //     localStorage.setItem('localCart',JSON.stringify([]));
  //   }
  //   else{
  //     cartData=JSON.parse(localCart);
  //    // cartData.push(data)
  //    localStorage.setItem('localCart',JSON.stringify([]));
  //   }
  // }

  clearCart() {
    //local cart sy data get kary gy
     let localCart = localStorage.getItem('localCart');
     //check kary gy data hai
     if (localCart) {
     //srings data ku convert kary gy objects mai
     let cartData = JSON.parse(localCart);
    //object ky ander products ku blank kardygy
      cartData.product = [];
      //localcart ku phir sy update karydy gy
       localStorage.setItem('localCart', JSON.stringify(cartData));
     } else {
     //if data nai hai toh builten blank set karydy
       //localStorage.setItem('localCart', JSON.stringify(''));
     }
   }

  /************************************** */

/* ******************************************************** */
  localAddToCart(data:CartHold){
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    //if there is no data in cart
    //if (!localCart){
      localStorage.setItem('localCart',JSON.stringify(data));
    // }
    //// else{
      //else if there is a data in cart
   //   // cartData=JSON.parse(localCart);
   //   // cartData.push(data)
   //   // localStorage.setItem('localCart', JSON.stringify(cartData));
////
  //  // }
////
  //  //this.cartData.emit(cartData)

    }

    localAddToCarts(data:Product){
      let cartData = [];
      let localCart = localStorage.getItem('localCart');
      if (!localCart){
        localStorage.setItem('localCart',JSON.stringify([data]));
      }
      else{
        cartData=JSON.parse(localCart);
        cartData.push(data)
        localStorage.setItem('localCart', JSON.stringify(cartData));
      }

      //this.cartData.emit(cartData)

      }
/* ******************************************************** */
    removeItemFromCart(productId: number) {
      let cartData = localStorage.getItem('localCart');
      if (cartData) {
        let items: Product[] = JSON.parse(cartData);
        items = items.filter((item: Product) => productId !== item.productId);
        localStorage.setItem('localCart', JSON.stringify(items));
        //this.cartData.emit(items);
      }
    }
/* ******************************************************** */
    getCategoryList(): Observable<Category[]>{

      let myUrl = `${this.myUrl}` + `category/findAll`  ;

      return this.http.get<Category[]>(myUrl).pipe(
          //tap( error ==> this.log('Fetched orders') ),
        catchError(this.errors.handleError<Category[]>('getCategoryList'))
      );

    }
/* ******************************************************** */
  getCategoryByNameList(catName:any): Observable<Category[]>{

    let myUrl = `${this.myUrl}` + `category/findAllByCategoryName/` +  catName ;

    return this.http.get<Category[]>(myUrl).pipe(
        //tap( error ==> this.log('Fetched orders') ),
      catchError(this.errors.handleError<Category[]>('getCategoryByNameList'))
    );

  }
/* ************************************************************* */
getProducts(categoryId: any): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `products/pos/findProductsByCategory/` + categoryId ;

  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('getProducts'))
  );
}
/* ************************************************************* */
popularProducts(): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `products/pos/findPopularProducts`  ;

  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('popularProducts'))
  );
}
/* ************************************************************* */
popularMeatProducts(): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `products/pos/findPopularMeatProducts`  ;

  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('popularMeatProducts'))
  );
}
/* ************************************************************* */
foodProducts(categoryId: number): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `products/pos/findFoodProducts/` + categoryId  ;

  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('foodProducts'))
  );
}
/* ************************************************************* */
getSearchProducts(search: any): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `products/pos/searchProducts/` + search ;

  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('getSearchProducts'))
  );
}

/* ************************************************************* */
sendSms(alert: AlertMessage): Observable<any>{
let myUrl = `${this.myUrl}` + `alert/sms` ;

    return this.http.post<any>(myUrl, alert).pipe(
      //tap( error ==> this.log('Save saveOrders') ),
    catchError(this.errors.handleError<any>('sendSms'))
  );

}

/* ************************************************************* */

getProductsByUPC(upc: string): Observable<ProductView>{

  let myUrl = `${this.myUrl}` + `products/pos/findProductsByUpc/` + upc ;

  return this.http.get<ProductView>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductView>('getProducts'))
  );

}
/* ************************************************************* */

getProductsBySKU(sku: string): Observable<ProductView>{

  let myUrl = `${this.myUrl}` + `products/pos/findProductsBySku/` + sku ;

  return this.http.get<ProductView>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductView>('getProducts'))
  );

}
/* ************************************************************* */

getProductsByPrice(price: any): Observable<ProductWrapper>{

  let myUrl = `${this.myUrl}` + `products/pos/searchProductsByPrice/` + price ;

  return this.http.get<ProductWrapper>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<ProductWrapper>('getProducts'))
  );

}

/* ************************************************************* */
getMaxProductId(): Observable<number>{

  let myUrl = `${this.myUrl}` + `products/getMaxProductId`  ;

  return this.http.get<number>(myUrl).pipe(
      //tap( error ==> this.log('Fetched Product') ),
    catchError(this.errors.handleError<number>('getMaxProductId'))
  );

}

/* ************************************************************* */
getProductMissingLocal(productId:number): Observable<ProductWrapper>{
  let remoteUrl = `${this.cloudApiUrl}` + `products/pos/getProductMissingLocal/` + productId ;
  //let remoteUrl = `${this.myUrl}` + `products/getProductMissingLocal/` + productId ;

  return this.http.get<ProductWrapper>(remoteUrl).pipe(
    catchError(this.errors.handleError<ProductWrapper>('getProductMissingLocal'))
  );
}

/* ************************************************************* */
saveProductListToLocalDB(productList: ProductView): Observable<ApiResponse>{
  let myUrl = `${this.myUrl}` + `products/pos/saveMissingProducts`  ;

  return this.http.post<ApiResponse>(myUrl, productList).pipe(
    catchError(this.errors.handleError<ApiResponse>('getProducts'))
  );


}


}
