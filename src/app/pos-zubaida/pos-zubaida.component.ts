import { Component, HostListener } from '@angular/core';
import {
  AdminUser,
  ApiResponse,
  CartHold,
  Category,
  Customer,
  CustomerRequest,
  Departments,
  OrderItemProductWrapper,
  OrderResponse,
  OrderSaveResponse,
  OrderSearch,
  Orders,
  OrdersCustomerWrapper,
  OrdersItems,
  Payment,
  PriceSummary,
  Product,
  ProductAttributes,
  ProductView,
  ProductWrapper,
} from '../model/model-classes.model';
import { CacheService } from '../services/cache.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { PaymentService } from '../services/payment.service';
import { environment } from 'src/environments/environment';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { DepartmentsService } from '../services/departments.service';
import Swal from 'sweetalert2';
import {faCloudUpload, faCloudDownload, faPerson, faPlusSquare, faDashboard, faRemove, faRupeeSign, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
// import { product } from '../data-type';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { StoreServiceService } from '../services/store-service.service';
import { OrdersService } from '../services/orders.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-pos-zubaida',
  templateUrl: './pos-zubaida.component.html',
  styleUrls: ['./pos-zubaida.component.scss']
})
export class PosZubaidaComponent {
  private myUrl = environment.apiUrl  ; 
  private cloudAPIUrl = environment.cloudAPIUrl;

  attemptCount=0;
  invoiceNumber: any = 'BL00012';
  selectedAgent:AdminUser | undefined; 
  mobileshow: any = false;
  nameSearchModal: any = false;
  logoName = environment.logoName;
  categoryId: number = 0;
  public isLoggedIn = false;
  faSignOut = faSignOut;
  faPerson=faPerson;
  result: any ='' ;
  totalDiscount: any = '';
  FbrCharges = 1;
  search: any;
  myScan = '';
  myCode = '';
  searchbyname: any;
  productcheckList: ProductView[] = [];
  searchProducts: ProductView[] = [];
  errormessage = '';
  productQuantity: any = 1;
  productWeight: number = 1;
  categoryMasterList: Category[] = [];
  categoryList: Category[] = [];
  cartDataList: CartHold = new CartHold();
  // cartDataList1: CartHold[] = [];
  todaydatashow:any='';

  signInUser: any = '';

  guestFlag = false;
  customer: Customer = new Customer();
  departmentList: Departments[] = [];
  departmentMasterList: Departments[] = [];
  rangeValue = 100;
  productViewList: ProductView[] = [];
  productList: Product[] = [];
  productMasterViewList: ProductView[] = [];
  // productViewList:ProductView=new  ProductView();
  errorMsg = '';
  spinnerDataLoad = false;
  selectedCategory: any;
  shopCategory: Category = new Category();
  searchFlag = false;
  searchParam = '';
  priceCheckPopup: boolean = false;
  retrieveSalePopup: boolean = false;
  productSearchPopup: boolean = false;
  cashModal: boolean = false;
  cardModal: boolean = false;
  customerBalance: number = 0;
  items: any[] = []; // Assuming this array contains your items

  priceSummary: PriceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
    grandTotal: 0,
  };

  holdSales: CartHold[] = [];


  name: any;
  email: any;
  phone: any;

  cartForm: FormGroup = new FormGroup({
    qty: new FormControl(),
    notes: new FormControl(''),
    pickupType: new FormControl('IN STORE'),
    pickupTime: new FormControl('MORNING'),
  });

  customerForm: FormGroup = new FormGroup({
    loginId: new FormControl(''),
    loginPassword: new FormControl(''),
    custId: new FormControl(''),
    custName: new FormControl(''),
    firstName: new FormControl('noman', [Validators.required]),
    lastName: new FormControl('khalid', [Validators.required]),
    businessFlag: new FormControl(false),
    addressId: new FormControl(''),
    email: new FormControl('noman@gmail.com', [Validators.required]),
    custType: new FormControl(''),
    phone1: new FormControl('3234234234234', [Validators.required]),
    phone2: new FormControl(''),
    custPic: new FormControl(''),
    profession: new FormControl(''),
    priority: new FormControl(''),
    bestWay: new FormControl(''),
    bestTime: new FormControl(''),
    sendSmsFlag: new FormControl(''),
    sendEmailFlag: new FormControl(''),
    address1: new FormControl(''),
    address2: new FormControl(''),
    city: new FormControl(''),
    stateProvince: new FormControl(''),
    country: new FormControl(''),
    postalCode: new FormControl(''),
  });

  faCloudUpload= faCloudUpload;
  faCloudDownload = faCloudDownload;
  errorsFlag: boolean=false;
  orderList:OrdersCustomerWrapper[]=[];
  orderViewList:OrdersCustomerWrapper[]=[];
  orderItemWrapperList:OrderItemProductWrapper[]=[];

  appName=environment.appName;
  salesAgentList:AdminUser[]=[];
  payment: Payment = new Payment();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cache: CacheService,
    private productService: ProductService,
    private departmentsService: DepartmentsService,
    private orderService: OrdersService,
    private customerService: CustomerService,
    private userService: UserService,
    private paymentService: PaymentService

  ) { }

  ngOnInit(): void {
    let holdData = localStorage.getItem('localCart');
    this.signInUser = sessionStorage.getItem("username");
    if (this.appName==='ZUBAIDA'){
      this.customer.firstName = 'POSCustomer';//this.customer.firstName;
      this.customer.email = 'info@techmaci.com';//this.customer.email;
    }

    this.salesAgentList = this.cache.getList("salesAgent");
    this.selectedAgent = JSON.parse(this.cache.get("selectedAgent"));
    

    if (this.salesAgentList===undefined || this.salesAgentList===null)
    {
      this.userService.getUserList().subscribe((data:AdminUser[])=> {
        //this.salesAgentList = data;
        if (data !==undefined){
          if (data.length>0){
            this.salesAgentList = [];
            for (let i=0; i<data.length; i++){
              let userRole = data[i].userRole;
              if (userRole==='AGENT'){
                this.salesAgentList.push(data[i]);
              }
            }
          }
        }


        this.cache.setList("salesAgent", this.salesAgentList);

        if (this.salesAgentList.length>0 && this.selectedAgent===undefined){
          this.selectedAgent = this.salesAgentList[0];
        }
        else if (this.salesAgentList.length>0 && this.selectedAgent===null){
          this.selectedAgent = this.salesAgentList[0];
        }

        
      });
        
    }
    else{
      if (this.salesAgentList.length>0 && this.selectedAgent===undefined){
        this.selectedAgent = this.salesAgentList[0];
      }
      else if (this.salesAgentList.length>0 && this.selectedAgent===null){
        this.selectedAgent = this.salesAgentList[0];
      }
    }

    if (holdData) {
      this.cartDataList = JSON.parse(holdData);
      this.customer.firstName = this.cartDataList.customer.firstName;
      this.customer.email = this.cartDataList.customer.email;
      this.customer.phone1 = this.cartDataList.customer.phone1;
    } //end if

    let test = this.cartDataList.product.length;

    //window.scrollTo(0, 0);
    this.errorMsg = '';
    this.searchFlag = false;
    let search = '';
    //let catId: number = Number(this.route.snapshot.paramMap.get('catId'));
    // let reload = this.cache.get('reload');
    // if (reload === null || reload === undefined) {
    //   this.cache.set('reload', 'T');
    //   window.location.reload();
    // } else if (reload === 'F') {
    //   this.cache.set('reload', 'T');
    //   window.location.reload();
    // } else if (reload === 'T') {
    //   let t1 = 1;
      //reload happned from same screen by calling window.location.reload()
    //}
    //this.spinnerDataLoad = true;
    /* ********* Department and Category List ****************** */
    // this.productService.getCategoryList().subscribe((data: Category[]) => {
    //   this.categoryList = data;
    //   this.calculateTotalPrice();
    //   this.shopCategory = this.getCategoryName(catId);
    // });
    // this.departmentsService
    //   .getDepartmentList()
    //   .subscribe((data: Departments[]) => {
    //     this.departmentMasterList = data;
    //     if (data != null || data != undefined) {
    //       for (let i = 0; i < this.departmentMasterList.length; i++) {
    //         if (this.departmentMasterList[i].activeFlag) {
    //           this.departmentList.push(this.departmentMasterList[i]);
    //         }
    //       }
    //     }
    //   });

    // if (catId !== null || catId !== undefined) {
    //   this.selectedCategory = catId;
    //   if (catId < 0) {
    //     //It is from global search in header
    //     this.productViewList = JSON.parse(this.cache.getList('searchProducts'));
    //     this.spinnerDataLoad = false;
    //     this.searchFlag = true;
    //     this.searchParam = this.cache.get('searchParam');
    //   } else {
    //     //Get all Products
    //     this.productService
    //       .getProducts(catId)
    //       .subscribe((data: ProductWrapper) => {
    //         let myData = data;
    //         if (myData != undefined) {
    //           if (myData.productList.length > 0) {
    //             this.productViewList = this.productDecorator(
    //               myData.productList
    //             );
    //             this.cache.setList(
    //               'productMasterViewList',
    //               JSON.stringify(this.productViewList)
    //             );
    //           } else {
    //             this.errorMsg = 'Items are out of Stock';
    //           }
    //           this.spinnerDataLoad = false;
    //         }
    //       });
    //   }
    // }
  } //ngOnInit
  /* *************************************************** */
  // program to sort array by property name
  /* ************************************************************* */
  categoryChange() {
    let t = this.selectedCategory;
    this.rangeValue = 100;
    let label = <HTMLLabelElement>document.getElementById('rangeValue');
    label.innerText = '100';
    this.errorMsg = '';
    if (this.selectedCategory === undefined) {
      return;
    }
    this.shopCategory = this.getCategoryName(Number(this.selectedCategory));
    //Reset current list
    this.productViewList.length = 0;
    this.spinnerDataLoad = true;
    //Get all Products for selected Category
    this.productService
      .getProducts(this.selectedCategory)
      .subscribe((data: ProductWrapper) => {
        let myData = data;
        if (myData != undefined) {
          if (myData.productList.length > 0) {
            this.productViewList = this.productDecorator(myData.productList);
            this.productList = myData.productList;
            this.cache.setList(
              'productMasterViewList',
              JSON.stringify(this.productViewList)
            );
          } else {
            this.errorMsg = 'Items are out of Stock';
          }
          this.spinnerDataLoad = false;
        }
      });
  }
  /* *********************************************************************** */
  productDecorator(productList: ProductView[]): any {
    //find out make and model
    //this.productViewList = productList;
    let myCategory: Category;
    let j = 0;
    for (let i = 0; i < productList.length; i++) {
      if (productList[i].productStatus === 'A') {
        this.productViewList[j] = new ProductView();

        myCategory = this.getCategoryName(productList[i].categoryId);

        this.productViewList[j].category = myCategory.category; // productList[i].category;
        this.productViewList[j].categoryId = productList[i].categoryId;
        this.productViewList[j].subCategory = myCategory.subCategory;
        this.productViewList[j].productId = productList[i].productId;
        this.productViewList[j].productName = productList[i].productName;
        this.productViewList[j].productDetails = productList[i].productDetails;
        this.productViewList[j].sku = productList[i].sku;
        this.productViewList[j].custId = productList[i].custId;
        this.productViewList[j].unitPrice = productList[i].unitPrice;
        this.productViewList[j].salePrice = productList[i].salePrice;
        this.productViewList[j].quantity = productList[i].quantity;
        this.productViewList[j].discount = productList[i].discount;
        this.productViewList[j].popularFlag = productList[i].popularFlag;
        this.productViewList[j].productStatus = productList[i].productStatus;
        this.productViewList[j].packagingAttributes =
          productList[i].packagingAttributes;
        this.productViewList[j].cuttingAttributes =
          productList[i].cuttingAttributes;
        this.productViewList[j].extraAttributes =
          productList[i].extraAttributes;
        this.productViewList[j].optionsAttributes =
          productList[i].optionsAttributes;

        this.productViewList[j].showFlag =
          productList[i].productStatus === 'A' ? true : false;

        //Just for safe side
        this.productViewList[j].productImage = productList[i].productImage;
        this.productViewList[j].imageMimeType = productList[i].imageMimeType;
        j++;
      }
    }
    return this.productViewList;
  }
  /* *********************************************************************** */
  getCategoryName(categoryId: any): Category {
    let category: Category = new Category();
    for (let i = 0; i < this.categoryMasterList.length; i++) {
      if (categoryId === this.categoryMasterList[i].categoryId) {
        category.categoryId = this.categoryMasterList[i].categoryId;
        category.category = this.categoryMasterList[i].category;
        category.subCategory = this.categoryMasterList[i].subCategory;

        break;
      }
    }

    return category;
  }
  /* ************************************************************** */

  addToCart(productView: ProductView, quantity: number = 1) {
    if (productView) {
      // Increment product quantity

      let rcvdProduct = new CartHold();

      let localCartData = localStorage.getItem('localCart');
      if (localCartData) {
        //Now get the existing cart with products/customer and other data
        rcvdProduct = JSON.parse(localCartData);
      }
      else {
        //create brand new cart 
        rcvdProduct.customer = new Customer();
        rcvdProduct.shipping = this.cartDataList.shipping;
        rcvdProduct.subTotal = this.cartDataList.subTotal;
        rcvdProduct.taxes = this.cartDataList.taxes;
        rcvdProduct.transactionId = 0;
        rcvdProduct.total = this.cartDataList.total;

      }
      productView.quantity = this.productQuantity;
      productView.agentId = this.selectedAgent?.userId;
      productView.loginId = this.selectedAgent?.loginId;
      productView.firstName = this.selectedAgent?.firstName;

      rcvdProduct.product.push(productView);

      this.productService.localAddToCart(rcvdProduct);
      //this.cartDataList1.push(rcvdProduct);


      // Add the product directly to the cart
      // this.productService.localAddToCart(cartHold);

      // Show confirmation message
      // Swal.fire('Shopping Cart', 'Item has been added to Cart', 'success');

      // Optionally, update cache or perform any other actions
      this.cache.set('reload', 'F');

      // Refresh the page
      window.location.reload();


      // Log productId and quantity to console
    } else {
      console.warn('Product is empty');
    }
  }

  /* ************************************************************** */
  onSearch() {
    let t1 = this.search;
    let t2 = <HTMLInputElement>document.getElementById('name-search');
    this.search = t2.value;

    if (
      this.search === null ||
      this.search === undefined ||
      this.search === ''
    ) {
    }

    this.productService.getCategoryList().subscribe((data: Category[]) => {
      this.categoryList = data;
    });

    this.productService
      .getSearchProducts(this.search)
      .subscribe((data: any) => {
        this.searchProducts = this.productDecorator(data.productList);
        if (this.searchProducts.length > 0) {
          this.cache.setList(
            'searchProducts',
            JSON.stringify(this.searchProducts)
          );
          this.cache.set('searchParam', this.search);
          this.nameSearchModal = true;
        } else {
          this.errormessage = 'No Record, No Record Found';

          setTimeout(() => {
            Swal.fire('No Record, No Record Found');
            this.showAlert();
          }, 6000);
        }
      });
  }
  /* ************************************************************** */
  showAlert() {
    this.search = '';
    this.errormessage = '';
  }
  /* ************************************************************** */
  nameSearch(event: KeyboardEvent) {
    let s1 = event;
    if (event.key === 'Enter') {
      //this.onSearch();
      let nameSearch = <HTMLInputElement>document.getElementById('name-search');
      this.search = nameSearch.value;
  
      if (this.search === null || this.search === undefined || this.search === '' ) 
      {
          //Don't do anything
      }
      else{
        this.productService.getSearchProducts(this.search).subscribe((data) => {
          //let productId = data.productId;
          this.productcheckList =data.productList;
          if (this.productcheckList === null) {
            Swal.fire('Not Found', 'Product Does not exist', 'error');
          } 
          
        });

      }



    }
  }
  /* ************************************************************** */
  upcSearch(event: any) {
    let myScan = '';
    if (event.code === 'Enter') {
      let qtyInput = <HTMLInputElement>document.getElementById('upc-search');
      if (qtyInput === undefined) {
        return;
      }
      let upc = qtyInput.value;
      if (upc !== undefined || upc !== '') {
        //serach product by UPC
        this.productService.getProductsByUPC(upc).subscribe((data) => {
          let productId = data.productId;
          // this.searchbyname=data.productList;
          if (productId === null) {
            Swal.fire(
              'Not Found',
              'Product Does not exist for this UPC',
              'error'
            );
          } else if (productId !== null || productId !== undefined) {
            let rcvdProduct = new CartHold();

            let localCartData = localStorage.getItem('localCart');
            if (localCartData) {
              //Now get the existing cart with products/customer and other data
              rcvdProduct = JSON.parse(localCartData);

            }

            else {
              //create brand new cart of type cartHold
              rcvdProduct.customer = new Customer();

              rcvdProduct.shipping = this.priceSummary.delivery;
              rcvdProduct.subTotal = this.priceSummary.total;
              rcvdProduct.dicsount = this.priceSummary.discount;
              rcvdProduct.taxes = this.priceSummary.tax;
              rcvdProduct.transactionId = 0;
              rcvdProduct.total = this.priceSummary.grandTotal;
            }
            data.quantity = this.productQuantity;
            let found = false;
            for (let i = 0; i < rcvdProduct.product.length; i++) {
              if (rcvdProduct.product[i].productName === data.productName) {
                rcvdProduct.product[i].quantity = parseInt(rcvdProduct.product[i].quantity, 10) + parseInt(this.productQuantity, 10);
                rcvdProduct.product[i].agentId = this.selectedAgent?.userId;   
                rcvdProduct.product[i].loginId = this.selectedAgent?.loginId;   
                rcvdProduct.product[i].firstName = this.selectedAgent?.firstName;

                const row = document.getElementById(`product-row_${i}`); 
                if (row) {
                row.classList.add('blink');
                setTimeout(() => {
                 row.classList.remove('blink');
                }, 3000); 
                }
                localStorage.setItem('localCart', JSON.stringify(rcvdProduct))
                found = true;
                break;
              }
          

            }

            if (!found) {
              data.agentId = this.selectedAgent?.userId;
              data.loginId = this.selectedAgent?.loginId;
              data.firstName = this.selectedAgent?.firstName;

              rcvdProduct.product.push(data);
              this.productService.localAddToCart(rcvdProduct);
            }
         
          if (rcvdProduct.product.length === 0) {
              rcvdProduct.product.push(data);

              this.productService.localAddToCart(rcvdProduct);

            }

            if (rcvdProduct.product.length === undefined) {
              rcvdProduct.product.push(data);

              this.productService.localAddToCart(rcvdProduct);

            }

            if (rcvdProduct.product.length === null) {
              rcvdProduct.product.push(data);

              this.productService.localAddToCart(rcvdProduct);

            }

            // Save updated cart and refresh page
            localStorage.setItem('localCart', JSON.stringify(rcvdProduct));

            //this.cartDataList1.push(rcvdProduct);
            window.location.reload();
          }
        });
      }
    } else {
      myScan = event.target.value;
    }
  }
  /* ************************************************************** */
  skuSearch(event: any) {
    let myScan = '';
    if (event.code === 'Enter') {
      let qtyInput = <HTMLInputElement>document.getElementById('sku-search');
      if (qtyInput === undefined) {
        return;
      }

      let sku = qtyInput.value;
      if (sku !== undefined || sku !== '') {
        //serach product by UPC
        this.productService.getProductsBySKU(sku).subscribe((data) => {
          let productId = data.productId;
          //// this.searchbyname=data.productList;
          if (productId === null) {
            Swal.fire('Not Found', 'Product Does not exist', 'error');
          } else if (productId !== null || productId !== undefined) {
            let rcvdProduct = new CartHold();

            let localCartData = localStorage.getItem('localCart');
            if (localCartData) {
              //Now get the existing cart with products/customer and other data
              rcvdProduct = JSON.parse(localCartData);
            } else {
              //create brand new cart of type cartHold
              rcvdProduct.customer = new Customer();
              rcvdProduct.shipping = 0;
              rcvdProduct.subTotal = 0;
              rcvdProduct.taxes = 0;
              rcvdProduct.transactionId = 0;
              rcvdProduct.total = 0;
            }
            data.quantity = this.productQuantity;
            data.agentId = this.selectedAgent?.userId; 
            data.loginId = this.selectedAgent?.loginId; 
            data.firstName = this.selectedAgent?.firstName;

            rcvdProduct.product.push(data);

            this.productService.localAddToCart(rcvdProduct);
            //this.cartDataList1.push(rcvdProduct);

            this.productService.localAddToCart(rcvdProduct);
            window.location.reload();
          }
        });
      }
    } else {
      myScan = event.target.value;
    }
  }

  /* ************************************************************** */
  priceSearch(event: any) {
    let myScan = '';
    if (event.code === 'Enter') {
      let qtyInput = <HTMLInputElement>document.getElementById('price-search');
      if (qtyInput === undefined) {
        return;
      }

      let price = qtyInput.value;
      if (price !== undefined || price !== '') {
        //serach product by UPC
        this.productService.getProductsByPrice(price).subscribe((data) => {
          //let productId = data.productId;
          this.productcheckList =data.productList;
          if (this.productcheckList === null) {
            Swal.fire('Not Found', 'Product Does not exist', 'error');
          } 
          
        });
      }
    } else {
      myScan = event.target.value;
    }
  }



  /****************************** */

  priceCheckByUpc(event: any) {
    let myScan = '';
    //always reset the list
    //this.productcheckList.length=0;
    this.productcheckList = [];

    if (event.code === 'Enter') {
      let qtyInput = <HTMLInputElement>document.getElementById('priceCheck');
      if (qtyInput === undefined) {
        return;
      }
      let upc = qtyInput.value;
      if (upc !== undefined || upc !== '') {
        //serach product by UPC
        this.productService.getProductsByUPC(upc).subscribe((data) => {
          let productId = data.productId;
          // this.searchbyname=data.productList;
          if (productId === null) {
            Swal.fire(
              'Not Found',
              'Product Does not exist for this UPC',
              'error'
            );
          } else if (productId !== null || productId !== undefined) {
            let rcvdProduct = new ProductView();
            //let localCartData = localStorage.getItem('localCart');
            // if (localCartData) {
            //Now get the existing cart with products/customer and other data
            // rcvdProduct = JSON.parse(localCartData);
            //  } else {
            //create brand new cart of type cartHold
            //  rcvdProduct.customer = new Customer();
            //  rcvdProduct.shipping = 0;
            //   rcvdProduct.subTotal = 0;
            //  rcvdProduct.taxes = 0;
            //  rcvdProduct.transactionId = 0;
            //  rcvdProduct.total = 0;
            // }
            rcvdProduct.productName = data.productName;
            rcvdProduct.discount = data.discount;
            rcvdProduct.unitPrice = data.unitPrice;
            rcvdProduct.salePrice = data.salePrice;
            rcvdProduct.agentId = this.selectedAgent?.userId; 
            rcvdProduct.loginId = this.selectedAgent?.loginId;
            rcvdProduct.firstName = this.selectedAgent?.firstName;

            this.productcheckList.push(rcvdProduct);
            //this.cartDataList.push(rcvdProduct);



            //data.quantity = this.productQuantity;
            // rcvdProduct.product.push(data);
            // this.productService.localAddToCart(rcvdProduct);
            // this.cartDataList.push(rcvdProduct);
            // window.location.reload();
          }
        });
      }
    } else {
      myScan = event.target.value;
    }
  }

  /* ************************************************************** */
  removeCart() {
       

    Swal.fire({
      title: 'Cancel Sale',
      text: 'Are you sure to Cancel Sale?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((response: any) => {

      if (response.value) {

        this.productService.clearCart();
        window.location.reload();
      }

    });



    
  }
  /* ************************************************************** */
  openPriceCheckPopup() {
    this.priceCheckPopup = true;
  }
  /* ************************************************************** */
  openRetrieveSalePopup() {
    let localCart = localStorage.getItem('localCart');
    //localcart data check
    if (localCart) {

      let cartDataArray = JSON.parse(localCart);
      if (Object.keys(cartDataArray.product).length > 0) {
        // Swal.fire("Please complete the transections");
        Swal.fire('WARNING', 'Please complete Your transaction', 'warning')
        return;
      } else {

        let cartData = cartDataArray[0];
      }
    } else {

    }

    //retrive list show
    let holdSalesObj = this.cache.getList('holdCartList');
    this.holdSales = holdSalesObj;


    let holdSaleArray: CartHold[] = [];
    //Not an array, just carthold object
    if (this.holdSales.length === undefined) {
      holdSaleArray.push(holdSalesObj);
      this.holdSales = holdSaleArray;

    }

    this.retrieveSalePopup = true;

  }
  /* ************************************************************** */
  closeRetrieveSalePopup() {
    this.retrieveSalePopup = false;
  }
  /* *************************************************************** */
  closeNameSearchModal() {
    this.nameSearchModal = false;
  }
  /* ************************************************************** */
  closeModal() {
    this.priceCheckPopup = false;
    this.clearFields();
  }
  
  /* ************************************************************** */
  openCashModal() {
    // if (!this.customer.firstName) {
    //   // Show alert for required fields
    //   Swal.fire('WARNING', 'Please fill The Customer Name', 'warning');
    //   return; // Don't proceed with saving
    // }

    let localCart = localStorage.getItem('localCart')
    if (localCart === undefined || localCart === '' || localCart === null || localCart.length === 105 || localCart.length === 0) {
      Swal.fire('WARNING', 'Cart is Empty', 'warning');
      return;
    }


    this.payment.paymentMethod='CASH';

    this.cashModal = true;

  }
  /* ************************************************************** */
  closeCashModal() {
    this.cashModal = false;
    this.result='';
    this.customerBalance=0;
  }
  /* ************************************************************** */
  /* ************************************************************** */
  openCardModal() {

    let localCart = localStorage.getItem('localCart')
    if (localCart === undefined || localCart === '' || localCart === null || localCart.length === 105 || localCart.length === 0) {
      Swal.fire('WARNING', 'Cart is Empty', 'warning');
      return;
    }

    this.payment.paymentMethod='CARD';
    //this.cardModal = true;
    //No need to show the popup screen
    //this.calculateBalance()
    this.calculateCartTotal();
    this.result = this.priceSummary.total;

    this.onCustomerSave('CARD')

  }
  /* ************************************************************** */
  closeCardModal() {
    this.cardModal = false;
    this.result='';
    this.customerBalance=0;
  }

  /* ************************************************************** */
  clearFields() {
    // Clear the priceCheck property in the component
    let priceCheckInput = document.getElementById(
      'priceCheck'
    ) as HTMLInputElement; // Get the input element
    if (priceCheckInput) {
      priceCheckInput.value = ''; // Reset the input field value
    }

    this.productcheckList = [];
  }
  /* ************************************************************** */
  checkHoldSale(){

    let localCart = localStorage.getItem('localCart');
    //localCart = always one object of cartHold type
    //holdCarts =  could be array list of localCarts of type cartHold[]
    if (localCart) {
      Swal.fire({
        title: 'Hold Sale',
        text: 'Are you sure to Hold this Sale?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, hold it!',
        cancelButtonText: 'No, keep it'
      }).then((response: any) => {
  
        if (response.value) {
  
          this.holdSale();
        }
  
      });
  
    }
    else{
      Swal.fire('Please select Sale to Hold');
    }

  }

  // Method to hold the current sale
  holdSale() {
    // Check if any of the input fields are empty
    
    
    this.cartDataList.customer.firstName = this.customer.firstName;
    this.cartDataList.customer.email = this.customer.email;
    this.cartDataList.customer.phone1 = this.customer.phone1;


    // if (!this.customer.firstName) {
    //   // Show alert for required fields
    //   Swal.fire('WARNING', 'Please fill The Customer Name', 'warning');
    //   return; // Don't proceed with saving
    // }
    let holdCartList: CartHold[] = [];
    let localCart = localStorage.getItem('localCart');
    //localCart = always one object of cartHold type
    //holdCarts =  could be array list of localCarts of type cartHold[]
    if (localCart) {
      let holdCartListObj: any;
      //this cart list in hold already
      holdCartListObj = localStorage.getItem('holdCartList');

      if (holdCartListObj === null) {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(localCart);
        currentHoldData.transactionId = 1;

        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);
      }
      else if (holdCartListObj === undefined) {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(localCart);
        currentHoldData.transactionId = 1;

        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);

      }
      else if (holdCartListObj === '') {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(localCart);
        currentHoldData.transactionId = 1;
        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);
      }
      else if (holdCartListObj.length === 0) {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(localCart);
        currentHoldData.transactionId = 1;
        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);
      }

      else if (holdCartListObj === '[]') {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(localCart);
        currentHoldData.transactionId = 1;
        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);
      }

      else {
        //holdCartList is an array of cartHolds or it is an ONE object of CartHold
        // holdCartList= JSON.parse(holdCartListObj);
        //Only one object in Hold already
        let holdCartList = JSON.parse(holdCartListObj);
        let newHoldCartList: CartHold[] = [];

        let localCartObj: CartHold = JSON.parse(localCart);
        if (holdCartList.length === undefined) {

          localCartObj.transactionId = holdCartList.transactionId + 1;

          localCartObj.customer = this.customer;
          newHoldCartList.push(holdCartList);
          newHoldCartList.push(localCartObj);
          //Overwrite current one CartHold Object in cache with 2 carthold for 2 customers
          this.cache.setList('holdCartList', newHoldCartList);

        }
        else if (holdCartList.length > 0) {
          //This is the case when CartHold is having multiple customers cart
          let newHoldCartList: CartHold[] = [];
          let localCartObj: CartHold = JSON.parse(localCart);
          localCartObj.transactionId = holdCartList[holdCartList.length - 1].transactionId + 1;
          localCartObj.customer = this.customer;




          newHoldCartList.push(...holdCartList);
          newHoldCartList.push(localCartObj);
          //Overwrite current one CartHold Object in cache with 2 carthold for 2 customers
          this.cache.setList('holdCartList', newHoldCartList);

        }

      }//else
      localStorage.removeItem('localCart');
      window.location.reload();

    }
  }// Reload the window
  /* ************************************************************** */
  appendToResult(value: string) {
    this.result += value;
    this.calculateBalance();
  }
  /* ************************************************************** */
  clear() {
    this.result = '';
  }
  /* ************************************************************** */
  backSpace() {
    // Remove the last character from cashPaid
    this.result = this.result.slice(0, -1);
  }

  calculate() {
    try {
      this.result = eval(this.result);
    } catch (error) {
      this.result = 'Error';
    }
  }
  /* ************************************************************** */
  signOut() {
    this.cache.set('currentUser', null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    sessionStorage.clear();

    this.cache.resetAllData();

    this.isLoggedIn = false;
    if (this.isLoggedIn) {
      //this.loginService.logOutUser();
      //this.serverLogout();
    }
    this.router.navigate(['login']);
  }
  /* ************************************************************** */
  chkNumber1(row: number) {
    let qtyInput = <HTMLInputElement>document.getElementById('Qty_' + row);
    let val = qtyInput.value;

    if (qtyInput != null || qtyInput != undefined) {
      let len = qtyInput.value.length;

      let qty = Number(val);
      if (qty<1){
          //0 or below not allowed
          Swal.fire('WARNING','0 or negative Qty is not allowed', 'warning');
          return;

      }
      if (len > 2) {
        qtyInput.value = qtyInput.value.toString().slice(0, 2);
      }
    }
  } //chkNumber
  /* ************************************************************* */
  qtyChange(row: number) {

    let qtyInput = <HTMLInputElement>document.getElementById('Qty_' + row);

    let val = qtyInput.value;

    if (qtyInput != null || qtyInput != undefined) {
      let len = qtyInput.value.length;

      let qty = Number(val);
      if (qty<1){
          //0 or below not allowed
          Swal.fire('WARNING','0 or negative Qty is not allowed', 'warning');
          return;

      }
      if (len > 2) {
        qtyInput.value = qtyInput.value.toString().slice(0, 2);
      }
    }

    let localCartData = localStorage.getItem('localCart');
    if (localCartData) {
      let qtydata = JSON.parse(localCartData);
      qtydata.product[row].quantity = qtyInput.value;
      localStorage.setItem('localCart', JSON.stringify(qtydata))


    }
    //alert('qtyChange'+ qty.value);

    this.cartDataList.product[row].quantity = qtyInput.value;

    this.calculateTotalPrice();
  }
  /* ******************************************************* */

  calculateTotalPrice() {
    let priceTotal: any = 0;
    if (this.cartDataList.product.length > 0) {
      for (let i = 0; i < this.cartDataList.product.length; i++) {
        let salePrice = this.cartDataList.product[i].salePrice;
        let unitPrice = this.cartDataList.product[i].unitPrice;

        if (salePrice != undefined) {
          //Added logic for MEAT Only products. Don't show price and don't add to Total
          let myCategory = this.getCategoryName(
            this.cartDataList.product[i].categoryId
          );
          if (myCategory.category !== 'MEAT') {
            let price = salePrice * this.cartDataList.product[i].quantity;
            let discountPrice = (price * this.cartDataList.product[i].discount)/100; 
            priceTotal = priceTotal + price - discountPrice;
          }
        }
        else if (unitPrice != undefined) {
          //Added logic for MEAT Only products. Don't show price and don't add to Total
          let myCategory = this.getCategoryName(
            this.cartDataList.product[i].categoryId
          );
          if (myCategory.category !== 'MEAT') {
           
            let price = unitPrice * this.cartDataList.product[i].quantity;
            let discountPrice = (price * this.cartDataList.product[i].discount)/100; 
            priceTotal = priceTotal + price - discountPrice;

          }
        }



      }//for loop

      let p1 = Number(priceTotal).toFixed(2);
      this.priceSummary.total = Number(p1);
      //this.priceSummary.tax = this.priceSummary.total  

    }
    else {
      //No item in cart
      this.priceSummary.total = Number(0);
    }


  }


  /* ********************************************* */
  removeItem(orderItem: any, index: any) {
    let item = orderItem;
    let details = this.cartDataList.product[index]?.productDetails;
    this.cartDataList.product.splice(index, 1);

    this.calculateTotalPrice();
    localStorage.setItem('localCart', JSON.stringify(this.cartDataList));
    //window.location.reload();
  }
  /* ******************************************************* */
  getProduct(productId: any): Product {
    let productData: Product = new Product();
    this.productService.getProduct(productId).subscribe((result) => {
      productData = result; //one record
      return productData;
    });
    return productData;
  }
  /* ********************************************** */
  guestCheckout() {
    let localCart = localStorage.getItem('localCart');
    if (localCart == '' || localCart == undefined) {
      Swal.fire('Your Cart is Emty');
      return;
    }
    if (localCart != null || localCart != undefined) {
      this.cartDataList = JSON.parse(localCart);
    }

    let currentUser: any = sessionStorage.getItem('currentUser');
    let customer: Customer = JSON.parse(currentUser);
    
    // let currentUser: any = sessionStorage.getItem('currentUser');
    //let customer: any = JSON.parse(localCart);
    this.commonCheckOut(localCart, customer);
  } //guestCheckout()
  /* ******************************************************* */
  commonCheckOut(localCart: any, customer: Customer) {

    if (localCart) {

      let orderSaveResponse: OrderSaveResponse = new OrderSaveResponse();

      let myRefferral = this.cache.get('representative');

      /* ******************** CHECKOUT Disable ************************** */
      //this.router.navigate(['/checkout']);

      /* ******************** ORDER Header Data ************************** */
      let order: Orders = new Orders();
      order.custId = customer.custId;
      order.orderType = 'POS';
      order.notes = this.cartForm.get('notes')?.value;
      order.pickupType = 'ONSITE'; //this.cartForm.get('pickupType')?.value;
      order.pickupTime = 'DAYTIME'; //this.cartForm.get('pickupTime')?.value;
      order.orderStatus = 'NEW';
      order.updatedBy = this.signInUser;
      order.price = this.priceSummary.price
      order.orderAmount = this.priceSummary.total;//order.price; //price/cut price of each item
      order.grandTotal = this.priceSummary.total + this.priceSummary.tax;;
      order.tax = this.priceSummary.tax.toFixed(2);
      order.shippingHandling = this.priceSummary.delivery.toFixed(2);


      orderSaveResponse.orders = order;

      let orderItem: OrdersItems;
      let productData: Product;

      /* ******************* ITEMS LOOP ********************* */
      this.cartDataList.product.forEach((items) => {
        orderItem = new OrdersItems();
        orderItem.productId = items.productId;
        orderItem.quantity = items.quantity;
        if (items.sellinPcs) {
          orderItem.quantity = items.quantity;
        }
        else {
          orderItem.measuringUnit = items.unitName;
          orderItem.weight = items.weight;
        }

        orderItem.discount = 0; //items.discount;
        orderItem.unitPrice = items.unitPrice;//items.unitPrice;
        orderItem.updatedBy = this.signInUser;
        orderItem.itemStatus = 'NEW';
        orderItem.agentId = items.agentId;

        orderSaveResponse.orderItems?.push(orderItem);

      });//this.cartDataList?.forEach((items)=>

      let len = orderSaveResponse.orderItems.length;
      orderSaveResponse.orders = order;

      this.orderService.saveOrder(orderSaveResponse).subscribe(data => {
        if (data != undefined) {
          let orderId = data.orders?.orderId;
          let orderNum = data.orders?.orderNum;
          if (orderId) {
            if (data.orders != null || data.orders != undefined) {
              let myOrder: Orders = data.orders;
              let items = data.orderItems;
              //Payment save
              this.payment.orderId = orderId;
              this.paymentService.savePayment(this.payment).subscribe(data => {
                if (data != undefined) {
                  let resp = data.statusCode;
                }
              });

              let currentUser: any = sessionStorage.getItem('currentUser');
              let myCustomer: Customer = JSON.parse(currentUser);
              this.invoiceNumber = 'BL' + orderId;

              this.todaydatashow = data.orders.createDate;
              localStorage.setItem('localCart', '');
              Swal.fire('Submit', 'Order#' + orderNum + ' has been created.', 'success')
                .then((result) => {
                  if (result.isConfirmed) {
                    // Reload the page
                    window.location.reload();
                  }
                });

              this.cache.set('reload', 'F');
              this.printThermal();

            }
            else {
              window.location.reload();

            }

          }
        }

      });


    }//end if localCart
  }//commonCheckOut()







  /* ******************************************************* */
  weightChange(index: number) {
    //let qty = this.cartForm.get('qty')?.value;
    let qty = <HTMLInputElement>document.getElementById('weight_' + index);
    //alert('qtyChange'+ qty.value);
    this.cartDataList.product[index].quantity = qty.value;
    this.calculateTotalPrice();
  }
  /* ********************************************* */

  // toFixDecimalNumber(item: Product): number {
  //   let myNumber = '';
  //   if (item.sellinPcs) {
  //     myNumber = Number(item.quantity * item.salePrice).toFixed(2);
  //   } else {
  //     myNumber = Number(item.weight * item.salePrice).toFixed(2);
  //   }
  //   return Number(myNumber);
  // }

  // toNumber(price: any): number {
  //   let myNumber = Number(price).toFixed(2);
  //   return Number(myNumber);
  // }

  // toFixDecimalNumbera(quantity: any, salePrice: any): number {
  //   let myNumber = Number(quantity * salePrice).toFixed(2);
  //   return Number(myNumber);
  // }

  itemTotal(product: ProductView): any {
    let totalPrice;
    let tax=0;
    this.attemptCount++;
    if (product.salePrice !== null && product.salePrice !== undefined) 
      {

        let price = product.salePrice * product.quantity; //660
        let discountPrice = (price * product.discount)/100; //10% 66
        let priceAfterDiscount = price - discountPrice; //660-66=594

        tax = (priceAfterDiscount * product.tax)/100; //106.92
        totalPrice = Number(priceAfterDiscount + tax).toFixed(2);

      //tax = Number((product.quantity * product.salePrice)*product.tax/100);
      //totalPrice = (Number(product.quantity * product.salePrice) + tax ).toFixed(2);
    } 
    else 
    {
      let price = product.unitPrice * product.quantity; //660
      let discountPrice = (price * product.discount)/100; //10% 66
      let priceAfterDiscount = price - discountPrice; //660-66=594

      tax = (priceAfterDiscount * product.tax)/100; //106.92
      totalPrice = Number(priceAfterDiscount + tax).toFixed(2);

//      tax=Number((product.quantity * product.unitPrice)*product.tax/100);
//      totalPrice = (Number(product.quantity * product.unitPrice) + tax).toFixed(2);
    }

    //this.priceSummary.total = this.priceSummary.total + Number(totalPrice);
    return totalPrice;
  }

 

  tax(product: ProductView): any {
    let totalTax;
    

    if (product.salePrice !== null && product.salePrice !== undefined) {
      let price = product.salePrice * product.quantity; //660
      let discountPrice = (price * product.discount)/100; //10% 66
      let priceAfterDiscount = price - discountPrice; //660-66=594

      totalTax = (priceAfterDiscount * product.tax)/100; //106.92
      //totalTax = Number((product.quantity * product.salePrice)*product.tax/100).toFixed(2);
    } 
    else {
      let price = product.unitPrice * product.quantity; //660
      let discountPrice = (price * product.discount)/100; //10% 66
      let priceAfterDiscount = price - discountPrice; //660-66=594

      totalTax = (priceAfterDiscount * product.tax)/100; //106.92
    
    //  totalTax = Number((product.quantity * product.unitPrice)*product.tax/100).toFixed(2);
    }

    //this.priceSummary.tax +=  Number(totalTax);

    return Number(totalTax).toFixed(2);
  }





  /* ********************************************* */
  chkNumber() {
    if (this.productQuantity != null || this.productQuantity != undefined) {
      let len = this.productQuantity.toString().length;

      if (len > 2) {
        this.productQuantity = Number(
          this.productQuantity.toString().slice(0, 2)
        );
      }
    }
  } //chkNumber

  /* ************************************************************ */
  // get f(): { [key: string]: AbstractControl } {
  //   return this.customerForm.controls;
  // }

  /* ************************************************************ */
  onCustomerSave(source: any) {
    // Check if any of the input fields are empty
    if (this.result < this.priceSummary.total) {

      Swal.fire('WARNING', 'Payment is Not Enough', 'warning');
      return; // Don't proceed with saving


    }

    this.payment.paymentMethod = source;
    this.payment.discount = this.priceSummary.discount;
    this.payment.taxesAmount = this.priceSummary.tax;
    this.payment.totalAmount = this.priceSummary.grandTotal;
    this.payment.currency = environment.currency;
    

    //This methods gets called from Guest Customer Data Entry form, when user click Checkout after entering his/her data.
    let customer = new Customer();
    customer = this.convertCustFormToVar(customer);

    customer.firstName = 'POSCustomer';//this.customer.firstName;
    customer.email = 'info@techmaci.com';//this.customer.email;
    customer.phone1 = this.customer.phone1;
    customer.custType = 'C';
    customer.priority = 1;
    customer.loginPassword = '123';

    let customerRequest: CustomerRequest = new CustomerRequest();
    customerRequest = customer;

    this.customerService.saveCustomer(customerRequest).subscribe((data) => {
      let userData = data;
      if (data !== undefined) {
        let customer = data.customer;
        if (customer.custId !== null) {
          this.signInUser = this.signInUser;
          sessionStorage.setItem('signInUser', this.signInUser);
          sessionStorage.setItem('currentUser', JSON.stringify(customer));

          this.guestCheckout();
          // window.location.reload();
        }
      }
    });
  }

  /* ************************************************************** */

  convertToForm(customer: Customer) {
    this.customerForm.get('loginId')?.setValue(customer.loginId);
    this.customerForm.get('loginPassword')?.setValue(customer.loginPassword);
    this.customerForm.get('firstName')?.setValue(customer.firstName);
    this.customerForm.get('lastName')?.setValue(customer.lastName);
    this.customerForm.get('email')?.setValue(customer.email);
    this.customerForm.get('phone1')?.setValue(customer.phone1);
    this.customerForm.get('address1')?.setValue(customer.address);
    this.customerForm.get('city')?.setValue(customer.city);
    this.customerForm.get('stateProvince')?.setValue(customer.stateProvince);
    this.customerForm.get('country')?.setValue(customer.country);
    this.customerForm.get('postalCode')?.setValue(customer.postalCode);
  }

  /* ******************************************* */
  convertCustFormToVar(customer: Customer) {
    customer.loginId = this.customerForm.get('loginId')?.value;
    customer.loginPassword = this.customerForm.get('loginPassword')?.value;
    customer.custName = this.customerForm.get('custName')?.value;
    customer.firstName = this.customerForm.get('firstName')?.value;
    this.signInUser = this.signInUser;
    customer.lastName = this.customerForm.get('lastName')?.value;
    customer.email = this.customerForm.get('email')?.value;
    customer.loginId = customer.email; //Important
    customer.custName = customer.email; //Important
    customer.businessFlag = this.customerForm.get('businessFlag')?.value;
    customer.phone1 = this.customerForm.get('phone1')?.value;
    //customer.phone2 = this.customerForm.get('phone2')?.value;
    customer.profession = this.customerForm.get('profession')?.value;
    customer.bestWay = this.customerForm.get('bestWay')?.value;
    customer.bestTime = this.customerForm.get('bestTime')?.value;
    customer.sendSmsFlag = this.customerForm.get('sendSmsFlag')?.value;
    customer.sendEmailFlag = this.customerForm.get('sendEmailFlag')?.value;
    customer.address = this.customerForm.get('address1')?.value;
    customer.city = this.customerForm.get('city')?.value;
    customer.stateProvince = this.customerForm.get('stateProvince')?.value;
    customer.country = this.customerForm.get('country')?.value;
    customer.postalCode = this.customerForm.get('postalCode')?.value;

    return customer;
  }
  /* *********************************************************************************** */

  printThermal(): void {
    /* Must open Chrome in KIOSK mode */
    /* "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk-printing */

    let popupWin;
    //let printContents:HTMLElement = (document.getElementById('print-section-0').innerHTML) as HTMLElement ;
    popupWin = window.open('', '_blank');
    if (popupWin != null || popupWin != undefined) {
      // popupWin.document.open();

      this.customer.firstName ='POSCustomer';

      let orderAddress =
        this.customer?.address +
        ',' +
        this.customer?.city +
        ',' +
        this.customer?.stateProvince +
        ',' +
        this.customer?.postalCode;

      let myCss = this.getCss();

      let myHead = `
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Niks Receipt</title>
    </head>    `;

      let myHtml = ` <html> ` + myHead;
      
      let myBodyOrder =
        `<body onload="window.print();window.close();">
    <div class="ticket">
    <img src="assets/images/logos/zubaida-slip-logo.png" id="imagea" width: 20mm; text-align: center; ">
    <p style="margin-left:30px !important;"><b>Z GENERATIONS</b><br>
    NTN # 8057991-3</p>
 
    <h1 class="centered"  style="font-size:13px;margin-left:30px !important;"><b>Sale Receipt </b></h1>
    <h1 class="centered"  style="font-size:13px;margin-left:30px !important;"><b> ` +
        this.customer.firstName + `  (` + this.customer.phone1 + ` )` +
        `</b></h1>` +  
        `<h1 class="centered"  style="font-size:13px;margin-left:30px !important;"><b> ` +
        this.todaydatashow + `</b></h1>` +
        
        `<table style="list-style:none;font-size:12px;text-align:left; ">
            <thead>
                <tr >
                    <td colspan="6" style="text-align: left;border-top: 1px solid #000;"><b>Product Description</b></td>
                </tr>
                <tr >
                <td style="text-align: left;border-top: 1px solid #000;"><b>Price</b></td>
                <td style="text-align: left;border-top: 1px solid #000;" ><b>Qty</b></td>
                <td style="text-align: left;border-top: 1px solid #000;" ><b>Discount</b></td>
                <td style="text-align: left;border-top: 1px solid #000;"><b>Tax</b></td>
                <td style="text-align: left;border-top: 1px solid #000;"><b>GST%</b></td>
                <td style="text-align: left;border-top: 1px solid #000;"><b>Total</b></td>
            </tr>
            </thead>` +
            `<tbody >`;

      let myItems = ``;
      let subtotal = 0;
      let taxItem = 0;
      let totalTax=0;
      let FbrCharges = 0;
      let total = 0;
      let itemDiscount=0;

      for (let i = 0; i < this.cartDataList.product.length; i++) {
        const price = (this.cartDataList.product[i].salePrice
          ? this.cartDataList.product[i].salePrice
          : this.cartDataList.product[i].unitPrice)

        taxItem = this.tax(this.cartDataList.product[i]); //((price * this.cartDataList.product[i].quantity) * this.cartDataList.product[i].tax )/100;  
        subtotal = subtotal + price * this.cartDataList.product[i].quantity ;
        // tax = this.cartDataList[i].tax || 0 ;
        total = subtotal - this.totalDiscount + taxItem;
        totalTax = totalTax + taxItem;
        itemDiscount = this.cartDataList.product[i].discount;  //(this.cartDataList.product[i].unitPrice - this.cartDataList.product[i].salePrice)

//        let price = product.unitPrice * product.quantity; //660
      let discountPrice = (price * itemDiscount)/100; //10% 66
      let priceAfterDiscount = price - discountPrice; //660-66 = 594

      let itemTax = (priceAfterDiscount * this.cartDataList.product[i].tax)/100; //106.92
      let totalPrice = Number(priceAfterDiscount + itemTax).toFixed(2);

      //TOTALS
      totalTax = totalTax + itemTax;
      subtotal = subtotal + priceAfterDiscount;


        myItems +=
          `<tr>
            <td colspan="6" style="text-align: left;border-top: 1px solid #000;"><b>` +
          this.cartDataList.product[i].productName + `( ` + this.cartDataList.product[i].upc + ` )` +
          `</b></td>
        </tr>
        <tr>
            <td><b>` +
            price.toFixed(2) +
          
          `</b></td>
            <td><b>` +
            this.cartDataList.product[i].quantity +
          `</b></td>
           <td><b>` +
            itemDiscount +
          `</b></td>

            <td><b>` +
            itemTax +
          `</b></td>
            <td><b>` +
            this.cartDataList.product[i].tax +
          `</b></td>
            <td><b>` +
            totalPrice +
          `</b></td>
        </tr>`;
      }


      let mySubTotal = Number(subtotal).toFixed(2);
      let myDiscount = (Number(this.totalDiscount)).toFixed(2);
      let myTax = (Number(totalTax)).toFixed(2);
      let fbrPos = (Number(this.FbrCharges)).toFixed(2);
      let myTotal = (Number(this.priceSummary.grandTotal)).toFixed(2);

      let myBottonHtml =
        `

        </tbody>
       
        
        <tfoot>
        <tr>
        <td style="text-align: left;border-top: 1px solid #000;">Sub Total:</td>
        <td style="text-align: left;border-top: 1px solid #000;">Rs ` +
        mySubTotal +
        ` </td>
        <td  colspan="4" style="text-align: left;border-top: 1px solid #000;">&nbsp;</td>
        </tr>
        <tr>
        <td >Discount:</td>
        <td style="text-align: center;">Rs ` +
        myDiscount +
        ` </td>
        </tr>
        <tr>
        <td >Tax:</td>
        <td style="text-align: center;">Rs ` +
        myTax +
        ` </td>
        </tr>
        
        <td ><b>Total: </b></td>
        <td style="text-align: center;"><b>Rs ` +
        myTotal +
        `</b> </td>
        </tr>
        <tr>
        <td >Cash Paid:</td>
        <td style="text-align: center;">Rs ` +
        this.result +
        ` </td>
        </tr>
        <td style="text-align: left;border-bottom: 1px solid #000;" ><b>Customer Balance: </b></td>
        <td style="text-align: left;border-bottom: 1px solid #000;"><b>Rs ` +
        (this.customerBalance).toFixed(2) +
        `</b> </td>
        <td colspan="4" style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
        </tr>
        </tfoot>
        </table>
        <p class="centered" style="margin-left:10px !important;">Invoice #` + this.invoiceNumber +
        `<br>
        
        
        <p class="centered" style="margin-left:10px !important;"><b> ** Terms And Conditions ** </b><p>

             <p style="font-size:7px;">
             Items once sold are Exchangeable/Replaceable Within 03 Days with original </p>
             <p style="font-size:7px;">packing(unused, unworn, tags attached, seals) and receipt </p>
             <p style="font-size:7px;"> along with all accessories, manuals, and warranty card that come with it. 
             </p>
             <p style="font-size:7px;margin-top:-5px !important;">
             Exchange or Return due to quality efficacy
             </p>
             <p style="font-size:7px;margin-top:-5px !important;">
             Items SOLD ON SALE are NOT exchangeable or replaceable. 
             </p>
             <p style="font-size:7px;margin-top:-5px !important;">
             GST is included in pricing. NO extra charges. 
             </p>
       
       <img src="assets/images/barcode.jpg" id="imagea" style="width:140px;height:30px">




       <p id="abc" class="centered" style="font-size:small;margin-left:10px !important;">
       Copyright© 2024 Z GENERATIONS. </p>
       <p id="abc" style="font-size:7px;">
       All rights Reserved to Software Developed By <b id="abcc">TechMaci</b>
       <br> 
       Ph +92 300-3932177 | Cell +92 21 37293088 
       </p>
       
       
   </div>
        <p style="margin-left:30px !important;">
        <b>Thanks for your purchase!</b>
        </p>
    
  </body>
  </html>`;
      let myFinalHtml = myHtml + myBodyOrder + myItems + myBottonHtml;
//alert(myFinalHtml);
      popupWin.document.write(myFinalHtml);

      popupWin.document.close();


    } //end if
  } //print()
  /* ******************************************************** */

  getCss(): string {
    //font-family: 'monospace sans-serif';

    let myCss = `
    * {
    font-size: 12px;
    font-family: 'Times New Roman';
}


#imageb {
  width:150px;
  height:65px;
}

#abc {
  font-size: 8px;
}

#abc2 {
  font-size: 8px;

}

#abcc{
  font-size: 10px;
}

#imagea{
   width:80px;
   height:80px;
}


#texta {
text-align :right;

}

td,
th,
tr,
table {
    border-top: 1px solid black;
    border-collapse: collapse;
    font-size:8px;
    margin-top:-20px;
}

td.description,
th.description {
    width: 75px;
    max-width: 75px;
    font-size:8px;
}

td.quantity,
th.quantity {
    width: 40px;
    max-width: 40px;
    word-break: break-all;
    font-size:8px;
}

td.price,
th.price {
    width: 60px;
    max-width: 60px;
    font-size:8px;

}

.centered {
    text-align: center !important;
    align-content: center;
    margin-left:36px !important;
}

.ticket {
    width: 200px;
    max-width: 200px;
}

img {
    max-width: inherit;
    width: inherit;
}

.totalitems{
  font-size:8px;
  font-weight:300px;
}

@media print {
    .hidden-print,
    .hidden-print * {
        display: none !important;
    }
}`;

    return myCss;
  }

  calculateFooterBalance(): void {

    let cashPaid = parseFloat(this.result) || 0;
    let cashDiscount = parseFloat(this.totalDiscount) || 0;
    this.priceSummary.discount = cashDiscount;
    let invoiceTotal = Number(this.priceSummary.total) || 0;

    //this.priceSummary.grandTotal = invoiceTotal - (this.priceSummary.tax + cashDiscount);
    // Calculate the balance
    this.customerBalance = (this.priceSummary.total - cashDiscount + this.priceSummary.tax);//this.priceSummary.total );
    this.priceSummary.grandTotal = this.customerBalance;

  }


  calculateBalance(): void {

    let cashPaid = parseFloat(this.result) || 0;
    //let cashDiscount = parseFloat(this.totalDiscount) || 0;
    //this.priceSummary.discount = cashDiscount;
    //let invoiceTotal = Number(this.priceSummary.total) || 0;

    //this.priceSummary.grandTotal = invoiceTotal - (this.priceSummary.tax + cashDiscount);
    // Calculate the balance
    this.customerBalance = cashPaid - (this.priceSummary.grandTotal);

  }

  getTodayDate(): Date {
    return new Date();
  }

  calculateTotalQuantity(): number {
    let totalQuantity = 0;
    for (let hold of this.holdSales) {
      for (let cartItem of hold.cartData) {
        totalQuantity += cartItem.quantity;
      }
    }
    return totalQuantity;
  }

  // Function to calculate total items
  getTotalItems(cartHold: any[]): number {
    let totalItems = 0;
    for (let cartItem of cartHold) {
      totalItems += cartItem.quantity;
    }
    return totalItems;
  }

  // Function to calculate grand total
  getGrandTotal(cartHold: any[]): number {
    let grandTotal = 0;
    for (let cartItem of cartHold) {
      const price = cartItem.salePrice ? cartItem.salePrice : cartItem.unitPrice;
      grandTotal += cartItem.quantity * price;
    }
    return grandTotal;
  }



  /******************** holdsale row data show in localcart***************************** */
  showHoldSaleDetails(cartHold: CartHold): void {
    let data = localStorage.getItem('localCart');
    this.productService.localAddToCart(cartHold);
    this.customer.firstName = cartHold.customer.firstName;
    this.customer.phone1 = cartHold.customer.phone1;
    this.customer.email = cartHold.customer.email;



    this.deleteHoldSalesFromCache(cartHold.transactionId);
    window.location.reload();
  }


  /***************************************************** */

  /********************retrive data click row delete*************************** */
  deleteHoldSalesFromCache(transactionId: any): void {

    const holdSalesFromCache = localStorage.getItem('holdCartList');
    if (holdSalesFromCache) {
      let holdSales: any[] = JSON.parse(holdSalesFromCache);
      //When only one object
      if (holdSales.length === undefined) {
        localStorage.setItem('holdCartList', '');
      }
      else {//when there is an array of objects
        for (let i = 0; i < holdSales.length; i++) {
          if (holdSales[i].transactionId === transactionId) {
            holdSales.splice(i, 1);
          }
        }
        localStorage.setItem('holdCartList', JSON.stringify(holdSales));
      }


    } else {

    }
    window.location.reload();
  }

/* ***************************************************** */
  calculateCartTotal(): any {
    this.priceSummary.total = 0;
    this.priceSummary.tax=0;
    let totalTax=0;

    if (this.cartDataList.product.length===0) return 0;

    for (let item of this.cartDataList.product) {
      //const price = item.salePrice ? item.salePrice : item.unitPrice;
      let price = this.itemTotal(item);
      totalTax = this.tax(item); //Number((item.quantity * price)* item.tax/100);

      this.priceSummary.total += Number(price) - Number(totalTax);     //item.quantity * price;

      
      this.priceSummary.tax+= Number(totalTax);

    }//for loop
    this.priceSummary.grandTotal = this.priceSummary.total - this.totalDiscount + this.priceSummary.tax;
    let finalPrice = Number(this.priceSummary.total - this.totalDiscount + this.priceSummary.tax);

    return finalPrice.toFixed(2);   //(this.priceSummary.total - this.totalDiscount + this.priceSummary.tax).toFixed(2);

  }
/* ***************************************************** */
  show() {
    this.mobileshow = false;
  }

  hide() {
    this.mobileshow = true;

  }

  uploadSale(){
    //step-1: find out the list of orders+orderItems generated for current date
    //step-2: Pass this list of orders+orderItems to cloud API
    let orderSaveResponseArray: OrderResponse ;

    this.orderService.getTodaysOrders().subscribe((data: OrderResponse) => {
      if (data !== undefined){

        this.errorsFlag=false;

        //this.orderList=data.orderCustomer;
        //this.orderItemWrapperList=data.orderItems;
        orderSaveResponseArray = data;


        if (data.orderCustomer!==null || data.orderCustomer!=undefined){
           this.orderService.uploadSales(orderSaveResponseArray)
          .subscribe((data1: ApiResponse) => {
               if (data1 !=undefined){
                if (data1.statusCode==0){
                  Swal.fire('Submit',   ' Succesfully Uploaded Sales!', 'success');
                  
                }
                else{
                  Swal.fire('Submit',   ' Uploaded Sales Fail', 'error');
                }
               }
          });


        }
      }

      });

    

  }
  downloadProducts(){
    //step-1: Get max productId from localhost DB
    //step-2: Pass this max productId to Cloud bases API
    //If there are new products added in Cloud, Cloud API will return a list of products
    //Step-4: Add these products to localhost DB 

    if (this.cloudAPIUrl === this.myUrl){
      
      return ;
    }
  

    let maxProductId:number;

    this.productService.getMaxProductId().subscribe((data:number)=>{
      maxProductId = data;

      if (maxProductId==0) return;

      //step-2
      this.productService.getProductMissingLocal(maxProductId).subscribe(
        (data1: ProductWrapper)=> {
          if (data1===undefined) return;
          if (data1.productList.length===0) return;

          this.productService.saveProductListToLocalDB(data1.productList).subscribe(
            (data2:ApiResponse) => {
              if (data2 !=undefined){
                if (data2.statusCode==0){
                  Swal.fire('Submit',   ' Succesfully Added Products!', 'success');
                  
                }
               }
            }
          );

        }
      );


    });




  }

  @HostListener('document:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  let t1=0;
  switch (event.key) {
    case 'F2':
      this.openProductSearchPopup();
      break;
    case 'F4':
      //alert('hold sale for F4');
      this.checkHoldSale();
      break;
    case 'F3':
      //alert('cash sale for F3');
      this.openCashModal();
      break;
    case 'F5':
      //alert('card sale for F5');
      this.openCardModal();
      break;  
    case 'F8':
      //alert('daily sale for F8');
      this.dailySale();
      break;
    
  }
}
  dailySale() {
    throw new Error('Method not implemented.');
  }

  agentChange(){
    this.selectedAgent;
    this.cache.set("selectedAgent", JSON.stringify(this.selectedAgent));
    

  }


  agentKey(event: any) {
    if (event.code === 'Enter') {
      let agentInput = <HTMLInputElement>document.getElementById('selectAgentInput');
      if (agentInput === undefined) {
        return;
      }
      let agent = agentInput.value;
      if (agent !== undefined || agent !== '') {
          for (let i=0; i<this.salesAgentList.length; i++){
            if (this.salesAgentList[i].loginId === agent){
              this.selectedAgent = this.salesAgentList[i];

              this.cache.set("selectedAgent", JSON.stringify(this.selectedAgent));

            }
          }
      }
  }
}

  /* ************************************************************* */
  discountChange(row: number) {

    let discountInput = <HTMLInputElement>document.getElementById('discount_' + row);

    let val = discountInput.value;

    if (discountInput != null || discountInput != undefined) {
      let len = discountInput.value.length;

      let qty = Number(val);
      if (qty<1){
          //0 or below not allowed
          Swal.fire('WARNING','0 or negative Qty is not allowed', 'warning');
          return;

      }
      if (len > 2) {
        discountInput.value = discountInput.value.toString().slice(0, 2);
      }
    }

    let localCartData = localStorage.getItem('localCart');
    if (localCartData) {
      let discountData = JSON.parse(localCartData);
      discountData.product[row].discount = discountInput.value;
      localStorage.setItem('localCart', JSON.stringify(discountData))


    }
    //alert('qtyChange'+ qty.value);

    this.cartDataList.product[row].discount = discountInput.value;

    this.calculateTotalPrice();
  }

  /* ************************************************************** */
  chkDiscountNumber1(row: number) {
    let discountInput = <HTMLInputElement>document.getElementById('discount_' + row);
    let val = discountInput.value;

    if (discountInput != null || discountInput != undefined) {
      let len = discountInput.value.length;

      let qty = Number(val);
      if (qty<1){
          //0 or below not allowed
          Swal.fire('WARNING','0 or negative discount is not allowed', 'warning');
          return;

      }
      if (len > 2) {
        discountInput.value = discountInput.value.toString().slice(0, 2);
      }
    }
  } //chkNumber

/* ************************************************************* */
openProductSearchPopup(){
  this.productSearchPopup=true;
}

closeProductSearchPopup(){
  this.productSearchPopup=false;
  this.productcheckList = [];
}

  /* ************************************************************** */
clearProductSearchFields() {
    // Clear the priceCheck property in the component
    let nameInput = document.getElementById(
      'name_search'
    ) as HTMLInputElement; // Get the input element

    if (nameInput) {
      nameInput.value = ''; // Reset the input field value
    }

    let skuInput = document.getElementById(
      'sku_search'
    ) as HTMLInputElement; // Get the input element

    if (skuInput) {
      skuInput.value = ''; // Reset the input field value
    }

    let priceInput = document.getElementById(
      'price_search'
    ) as HTMLInputElement; // Get the input element

    if (priceInput) {
      priceInput.value = ''; // Reset the input field value
    }

    //Empty the List
    this.productcheckList = [];
  }


  selectSearchProduct(product: ProductView){

    let localCartData = localStorage.getItem('localCart');
    if (localCartData) {
      let cartData = JSON.parse(localCartData);
      product.quantity=1;
      product.loginId = this.selectedAgent?.loginId;
      product.firstName = this.selectedAgent?.firstName;
      product.agentId = this.selectedAgent?.userId;
      if (product.tax === null){
        product.tax=18;
      }

      cartData.product.push(product);
      localStorage.setItem('localCart', JSON.stringify(cartData));
    }
    else{
      product.quantity=1;
      product.loginId = this.selectedAgent?.loginId;
      product.firstName = this.selectedAgent?.firstName;
      product.agentId = this.selectedAgent?.userId;
      if (product.tax === null){
        product.tax=18;
      }

      this.cartDataList.product.push(product);
      localStorage.setItem('localCart', JSON.stringify(this.cartDataList));
    }

    this.closeProductSearchPopup();
    window.location.reload();

  }


/* ************************** THE END ***************************************** */

}
