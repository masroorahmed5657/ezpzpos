import { Component, HostListener } from '@angular/core';
import {
  AdminUser,
  ApiResponse,
  BarcodeResponse,
  CartHold,
  Category,
  Customer,
  CustomerRequest,
  DbUpdate,
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
import { faCloudUpload, faCloudDownload, faPerson, faCreditCard, faCashRegister, faPlusSquare, faDashboard, faRemove, faRupeeSign, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
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
import { ReportsService } from '../services/reports.service';


@Component({
  selector: 'app-pos-zubaida',
  templateUrl: './pos-zubaida.component.html',
  styleUrls: ['./pos-zubaida.component.scss']
})
export class PosZubaidaComponent {
  private myUrl = environment.apiUrl;
  private cloudAPIUrl = environment.cloudAPIUrl;
  faCreditCard = faCreditCard;
  faCashRegister = faCashRegister;
  branchName = environment.branchName;

  totalSaleCount: number = 0;
  legacyReport: boolean = false;
  taxCouponFlag:boolean=false;

  attemptCount = 0;
  attempTotalCount = 0;
  invoiceNumber: any = 'BL00012';
  selectedAgent: AdminUser | undefined;
  mobileshow: any = false;
  nameSearchModal: any = false;
  logoName = environment.logoName;
  categoryId: number = 0;
  public isLoggedIn = false;
  faSignOut = faSignOut;
  faPerson = faPerson;
  result: any = '';
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
  todaydatashow: any = '';

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
    totalQty: 0,
    totalWithoutDiscount: 0
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

  faCloudUpload = faCloudUpload;
  faCloudDownload = faCloudDownload;
  errorsFlag: boolean = false;
  orderList: OrdersCustomerWrapper[] = [];
  orderViewList: OrdersCustomerWrapper[] = [];
  orderItemWrapperList: OrderItemProductWrapper[] = [];

  appName = environment.appName;
  cancelSaleFlag: boolean = true;
  retrieveSaleFlag: boolean = true;
  showTaxFlag: boolean = true;
  salesAgentList: AdminUser[] = [];
  payment: Payment = new Payment();
  fbrInvoiceNumber: any;
  fbrQRCode: BarcodeResponse = new BarcodeResponse();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cache: CacheService,
    private productService: ProductService,
    private departmentsService: DepartmentsService,
    private orderService: OrdersService,
    private customerService: CustomerService,
    private userService: UserService,
    private paymentService: PaymentService,
    private reportsService: ReportsService

  ) { }

  ngOnInit(): void {
    let holdData = localStorage.getItem('localCart');
    this.signInUser = sessionStorage.getItem("username");
    this.cancelSaleFlag = environment.cancelSaleFlag;
    this.retrieveSaleFlag = environment.retrieveSaleFlag;
    this.showTaxFlag = environment.showTaxFlag;
    this.attemptCount = 0;
    this.attempTotalCount = 0;


    if (!environment.posCustomerNameFlag) {
      this.customer.firstName = 'POSCustomer';//set default
    }
    if (!environment.posCustomerEmailFlag) {
      this.customer.email = 'info@techmaci.com';//set default
    }


    this.salesAgentList = this.cache.getList("salesAgent");
    this.selectedAgent = JSON.parse(this.cache.get("selectedAgent"));

    //Get totalSaleCount
    this.totalSaleCount = 0;

    this.reportsService.getDailySaleTotalCount().subscribe((data: number) => {
      if (data !== undefined) {

        this.totalSaleCount = data;
      }
    });


    if (this.salesAgentList === undefined || this.salesAgentList === null) {
      this.userService.getUserList().subscribe((data: AdminUser[]) => {
        //this.salesAgentList = data;
        if (data !== undefined) {
          if (data.length > 0) {
            this.salesAgentList = [];
            for (let i = 0; i < data.length; i++) {
              let userRole = data[i].userRole;
              if (userRole === 'AGENT') {
                this.salesAgentList.push(data[i]);
              }
            }
          }
        }


        this.cache.setList("salesAgent", this.salesAgentList);

        if (this.salesAgentList.length > 0 && this.selectedAgent === undefined) {
          this.selectedAgent = new AdminUser(); //this.salesAgentList[0];
        }
        else if (this.salesAgentList.length > 0 && this.selectedAgent === null) {
          this.selectedAgent = new AdminUser(); //this.salesAgentList[0];
        }
        else if (this.selectedAgent?.loginId === '') {
          this.selectedAgent = new AdminUser(); //this.salesAgentList[0];
        }


      });

    }
    else {
      if (this.salesAgentList.length > 0 && this.selectedAgent === undefined) {
        this.selectedAgent = this.salesAgentList[0];
      }
      else if (this.salesAgentList.length > 0 && this.selectedAgent === null) {
        this.selectedAgent = this.salesAgentList[0];
      }
    }

    if (holdData) {
      this.cartDataList = JSON.parse(holdData);
      this.customer.firstName = this.cartDataList.customer.firstName;
      this.customer.email = this.cartDataList.customer.email;
      this.customer.phone1 = this.cartDataList.customer.phone1;

      this.priceCalculationTotal();

    } //end if



    //window.scrollTo(0, 0);
    this.errorMsg = '';
    this.searchFlag = false;
    let search = '';

    //Only select Agent when it was not selected before
    setTimeout(() => {
      if (this.selectedAgent === undefined || this.selectedAgent === null) {
        this.agentFocus(true);
      }
      else {
        this.focusUpc(true);
      }

    }, 500);




  } //ngOnInit



  agentFocus(focusFlag: boolean) {
    let agentInput = <HTMLInputElement>document.getElementById('selectAgentInput');
    if (focusFlag) {
      if (this.selectedAgent === undefined || this.selectedAgent === null) {
        agentInput.focus();
      }
    }

    agentInput.autofocus = focusFlag;
  }


  ngAfterViewInit(): void {
    let len = this.cartDataList.product.length - 1;

    const discountColName = 'discount_' + len;
    this.discountFocus(false, discountColName);
    this.agentFocus(true);
  }

  discountFocus(focusFlag: boolean, discountColName: any) {
    let discountInput = <HTMLInputElement>document.getElementById(discountColName);


    if (discountInput !== null) {
      if (focusFlag) {
        discountInput.focus();
      }

      discountInput.autofocus = focusFlag;
    }
  }

  discountAllNotFocus() {
    for (let i = 0; this.cartDataList.product.length; i++) {

      let discountColName = 'discount_' + i;
      let discountInput = <HTMLInputElement>document.getElementById(discountColName);
      if (discountInput !== null) {


        discountInput.autofocus = false;
      }

    }





  }

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

      if (this.search === null || this.search === undefined || this.search === '') {
        //Don't do anything
      }
      else {
        this.productService.getSearchProducts(this.search).subscribe((data) => {
          //let productId = data.productId;
          this.productcheckList = data.productList;
          if (this.productcheckList === null) {
            Swal.fire('Not Found', 'Product Does not exist', 'error');
          }

        });

      }



    }
  }

  commonAdditionToCart(productView: ProductView) {

    //There are 3 possibilities when product/upc found:
    //1-There was no Cart available, brand new case
    //2-Cart available but no products
    //3-Cart available some products, and this upc is new to cart
    //4-Cart available and this upc scanned again, increase QTY
    let found = false;
    let foundRow = 0;
    //this.resetProductViewPrices(productView);
    //Check Cart in cache
    let localCartData = localStorage.getItem('localCart');
    let cartData: CartHold = new CartHold();

    if (localCartData) {
      //CASE-2,3,4
      //Now get the existing cart with products/customer and other data
      cartData = JSON.parse(localCartData);
      //check if there is any product in this cart
      if (cartData.product.length > 0) {
        //CASE 3 or 4, Check this product in Cart

        for (let i = 0; i < cartData.product.length; i++) {
          if (cartData.product[i].upc === productView.upc) {
            found = true;
            foundRow = i;//saved row found in
            break;

          }
        }//for loop
        if (!found) {
          //CASE-3-Cart available some products, and this upc is new to cart
          productView.quantity = 1;
          productView.agentId = this.selectedAgent?.userId;
          productView.loginId = this.selectedAgent?.loginId;
          productView.firstName = this.selectedAgent?.firstName;
          productView.price = this.getPrice(productView);
          productView.totalPrice = 0;
          productView.totalTax = 0;

          //@TODO Commented out 2024-09-06
          //productView.discount = 0;
          //productView.discountVal = 0;
          cartData.product.push(productView);
          this.productService.localAddToCart(cartData);

        }
        else {
          //CASE-4-Cart available and this upc scanned again, increase QTY
          //Get current Qty from Cart.product found and add one to it
          cartData.product[foundRow].quantity = Number(Number(cartData.product[foundRow].quantity) + 1);
          let price = this.getPrice(productView);
          //cartData.product[foundRow].price = Number(price) * Number(cartData.product[foundRow].quantity);
          this.cartDataList = cartData;
          this.calculateDiscount(this.cartDataList.product[foundRow].discount, foundRow);
          this.priceCalculationPerRow(foundRow);
          this.priceCalculationTotal();
          this.productService.localAddToCart(cartData);


          const row = document.getElementById(`product-row_${foundRow}`);
          if (row) {
            row.classList.add('blink');
            setTimeout(() => {
              row.classList.remove('blink');
            }, 25000);
          }


        }

      }
      else {
        //CASE-2: Cart available but no products
        //Add new item to product List for this cart
        productView.quantity = 1;
        productView.agentId = this.selectedAgent?.userId;
        productView.loginId = this.selectedAgent?.loginId;
        productView.firstName = this.selectedAgent?.firstName;
        productView.price = this.getPrice(productView);
        productView.totalPrice = 0;
        productView.totalTax = 0;

        //@TODO Commented out 2024-09-06
        // productView.discount = 0;
        // productView.discountVal = 0;

        cartData.product.push(productView);

        this.productService.localAddToCart(cartData);

      }



    }
    else {
      //CASE-1: No Cart available, No Item available, Brand new Empty Case
      //create brand new cart of type cartHold, already declared
      cartData.customer = new Customer();
      if (!environment.posCustomerNameFlag) {
        cartData.customer.firstName = 'POSCustomer';//set default
      }
      if (!environment.posCustomerEmailFlag) {
        cartData.customer.email = 'info@techmaci.com';//set default
      }
      cartData.customer.phone1 = this.customer.phone1;

      cartData.shipping = 0;
      cartData.subTotal = 0;
      cartData.dicsount = 0;
      cartData.taxes = 0;
      cartData.transactionId = 0;

      //Add new item to product List for this cart
      productView.quantity = 1;
      productView.agentId = this.selectedAgent?.userId;
      productView.loginId = this.selectedAgent?.loginId;
      productView.firstName = this.selectedAgent?.firstName;
      productView.price = this.getPrice(productView);
      productView.totalPrice = 0;
      productView.totalTax = 0;

      //@TODO Commented out 2024-09-06
      // productView.discount = 0;
      // productView.discountVal = 0;

      cartData.product.push(productView);

      this.productService.localAddToCart(cartData);

    }

    this.cartDataList = cartData; //Assign current local cartData
    //Finally, set all variables and focus on Discount
    let count = this.cartDataList.product.length - 1;
    this.priceCalculationPerRow(count);
    this.priceCalculationTotal();
    //Save again
    localStorage.setItem('localCart', JSON.stringify(this.cartDataList));

    let discountColName = '';
    if (found) {
      discountColName = `discount_${foundRow}`;
      this.discountFocus(true, discountColName);
    }
    else {
      discountColName = `discount_${count}`;
      this.discountFocus(true, discountColName);
    }


    setTimeout(() => {
      this.discountFocus(true, discountColName);
      let upcInput = <HTMLInputElement>document.getElementById('upc-search');
      if (upcInput === undefined) {
        return;
      }
      else {
        upcInput.value = '';
      }
    }, 500);




  }

  /* ************************************************************** */
  upcSearch(event: any) {
    let myScan = '';
    if (event.key === 'Enter') {
      let qtyInput = <HTMLInputElement>document.getElementById('upc-search');
      if (qtyInput === undefined) {
        return;
      }
      let upc = qtyInput.value;
      if (upc !== undefined || upc !== '') {
        if (this.selectedAgent?.loginId === undefined || this.selectedAgent?.loginId === '') {
          Swal.fire('Agent Required', 'Please select an Agent', 'warning');
          return;
        }

        // let found = false;
        // let foundRow = 0;
        let productView: ProductView = new ProductView();
        //serach product by UPC
        this.productService.getProductsByUPC(upc).subscribe((data) => {
          if (data === undefined) {
            Swal.fire(
              'Not Found',
              'Product Does not exist for this UPC',
              'error'
            );
          }
          productView = data;

          

          if (productView === null) {
            Swal.fire(
              'Not Found',
              'Product Does not exist for this UPC',
              'error'
            );
          }
          else if (productView !== null || productView !== undefined) {
            this.commonAdditionToCart(productView);

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

        if (sku !== undefined || sku !== '') {
          if (this.selectedAgent?.loginId === undefined || this.selectedAgent?.loginId === '') {
            Swal.fire('Agent Required', 'Please select an Agent', 'warning');
            return;
          }
          //serach product by SKU
          let productView: ProductView = new ProductView();
          this.productService.getProductsBySKU(sku).subscribe((data) => {
            let productId = data[0].productId;
            productView = data[0];

            if (productId === null) {
              Swal.fire('Not Found', 'Product Does not exist', 'error');
            }
            else if (productId !== null || productId !== undefined) {
              this.commonAdditionToCart(productView);
            }
          });
        }
      } else {
        myScan = event.target.value;
      }
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
        if (this.selectedAgent?.loginId === undefined || this.selectedAgent?.loginId === '') {
          Swal.fire('Agent Required', 'Please select an Agent', 'warning');
          return;
        }
        //serach product by Price
        let productView: ProductView = new ProductView();
        this.productService.getProductsByPrice(price).subscribe((data) => {
          productView = data.productList[0];
          let productId = productView.productId;

          this.productcheckList = data.productList;
          if (productView === null) {
            Swal.fire('Not Found', 'Product Does not exist', 'error');
          }
          else if (productId !== null || productId !== undefined) {
            this.commonAdditionToCart(productView);
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
            rcvdProduct.discountVal = data.discountVal;
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
    this.clearFields();
  }
  /* ************************************************************** */
  closeModal() {
    this.priceCheckPopup = false;
    this.clearFields();
  }

  /* ************************************************************** */
  openCashModal() {
    let localCart = localStorage.getItem('localCart')
    if (localCart === undefined || localCart === '' || localCart === null || localCart.length === 105 || localCart.length === 0) {
      Swal.fire('WARNING', 'Cart is Empty', 'warning');
      return;
    }
    if (this.customer.phone1 === undefined) {
      Swal.fire('WARNING', 'Please input Customer Phone Number', 'warning');
      return;
    }
    if (this.customer.phone1 === '') {
      Swal.fire('WARNING', 'Please input Customer Phone Number', 'warning');
      return;
    }



    this.payment.paymentMethod = 'CASH';

    this.focusUpc(false);
    this.agentFocus(false);
    //this.discountAllNotFocus();

    this.cashModal = true;
    let resultInput = <HTMLInputElement>document.getElementById('result');
    resultInput.focus();
    //this.cashModal.nativeElement.focus();
    if (this.priceSummary.grandTotal < 0) {

      resultInput.value = this.priceSummary.grandTotal.toFixed(2);
    }
    else {
      resultInput.value = ''; //(0).toFixed(2);
    }
    resultInput.autofocus = true;
    //resultInput.value='0';



  }
  /* ************************************************************** */
  closeCashModal() {
    this.cashModal = false;
    this.result = '';
    this.customerBalance = 0;
  }

  /* ************************************************************** */
  openCardModal() {

    let localCart = localStorage.getItem('localCart')
    if (localCart === undefined || localCart === '' || localCart === null || localCart.length === 105 || localCart.length === 0) {
      Swal.fire('WARNING', 'Cart is Empty', 'warning');
      return;
    }
    if (this.customer.phone1 === undefined) {
      Swal.fire('WARNING', 'Please input Customer Phone Number', 'warning');
      return;
    }
    if (this.customer.phone1 === '') {
      Swal.fire('WARNING', 'Please input Customer Phone Number', 'warning');
      return;
    }


    const button = document.getElementById('card-button') as HTMLButtonElement;
    button.disabled = true;

    this.payment.paymentMethod = 'CARD';
    //this.cardModal = true;
    //No need to show the popup screen
    //this.calculateBalance()
    //this.calculateCartTotal();
    this.result = this.priceSummary.total;

    this.onCustomerSave('CARD');

  }
  /* ************************************************************** */
  closeCardModal() {
    this.cardModal = false;
    this.result = '';
    this.customerBalance = 0;
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
  checkHoldSale() {

    let localCart = localStorage.getItem('localCart');
    //localCart = always one object of cartHold type
    //holdCarts =  could be array list of localCarts of type cartHold[]
    if (!this.customer.phone1) {
      // Show alert for required fields
      Swal.fire('WARNING', 'Please fill The Customer Phone before Hold', 'warning');
      return; // Don't proceed with saving
    }


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
    else {
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
      // if (qty<1){
      //     //0 or below not allowed
      //     Swal.fire('WARNING','0 or negative Qty is not allowed', 'warning');
      //     return;

      // }
      if (len > 2) {
        qtyInput.value = qtyInput.value.toString().slice(0, 2);
      }
    }
  } //chkNumber
  /* *************************************************************** */
  qtyAddMinus(row: number, action: string) {
    let qtyInput = <HTMLInputElement>document.getElementById('Qty_' + row);

    let val = qtyInput.value;

    //Note: Whenevr Qty changes, we must get original price from sale/unit Price and replace to price.

    if (qtyInput != null || qtyInput != undefined) {
      let len = qtyInput.value.length;
      let qty = Number(val);
      if (action === '+') {
        qty = qty + 1;
      }
      else {
        qty = qty - 1;
      }

      qtyInput.value = qty.toString();
      this.qtyChange(row);

    }

  }

  /* ************************************************************* */
  qtyChange(row: number) {

    let qtyInput = <HTMLInputElement>document.getElementById('Qty_' + row);

    let val = qtyInput.value;

    //Note: Whenevr Qty changes, we must get original price from sale/unit Price and replace to price.

    if (qtyInput != null || qtyInput != undefined) {
      let len = qtyInput.value.length;

      let qty = Number(val);
      // if (qty<1){
      //     //0 or below not allowed
      //     Swal.fire('WARNING','0 or negative Qty is not allowed', 'warning');
      //     return;

      // }
      if (len > 2) {
        qtyInput.value = qtyInput.value.toString().slice(0, 2);
      }

      let localCartData = localStorage.getItem('localCart');
      if (localCartData) {
        let qtydata: CartHold = JSON.parse(localCartData);
        qtydata.product[row].quantity = qtyInput.value;

        qtydata.product[row].price = this.getPrice(qtydata.product[row]);

        if (qty > 1) {
          qtydata.product[row].totalPrice = qtydata.product[row].price * qty;
          qtydata.product[row].totalTax = qtydata.product[row].totalTax * qty;

        }
        else if (qty === 0) {
          qtydata.product[row].quantity = 0;
          qtydata.product[row].totalPrice = 0;
          qtydata.product[row].totalTax = 0;
          qtydata.product[row].price = 0;
        }
        else if (qty === 1) {
          qtydata.product[row].quantity = qty;
          qtydata.product[row].totalPrice = qtydata.product[row].price * qty;

        }
        else if (qty < 0) {
          qtydata.product[row].quantity = qty;
          qtydata.product[row].totalPrice = qtydata.product[row].price * qty;

        }

        localStorage.setItem('localCart', JSON.stringify(qtydata));

        this.cartDataList = qtydata;

        this.calculateDiscount(this.cartDataList.product[row].discount, row);

        this.priceCalculationPerRow(row);
        this.priceCalculationTotal();

        localStorage.setItem('localCart', JSON.stringify(this.cartDataList));

      }
      else {
        //Nothing to do if there is no data in Cart
      }

    }

  }
  /* *************************************************************** */
  calculateQtyTotal(cartDataList: CartHold) {
    this.priceSummary.totalQty = 0;
    if (cartDataList !== undefined) {
      if (cartDataList.product.length > 0) {
        for (let i = 0; i < cartDataList.product.length; i++) {
          this.priceSummary.totalQty = this.priceSummary.totalQty + Number(cartDataList.product[i].quantity);
        }
      }
    }
  }

  /* ******************************************************* */



  /* ********************************************* */
  removeItem(orderItem: any, index: any) {
    let itemToRemove = this.cartDataList.product[index];
    //let details = this.cartDataList.product[index]?.productDetails;
    //this.cartDataList.product.splice(index, 1);

    this.cartDataList.product = this.cartDataList.product.filter(item => item !== itemToRemove);
    this.priceCalculationTotal();
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
      order.orderAmount = this.priceSummary.grandTotal;//order.price; //price/cut price of each item
      order.discount = this.priceSummary.discount;
      order.posName = environment.posName;
      order.branchName = environment.branchName;
      order.custPhone = this.customer.phone1;
      order.custEmail = this.customer.email;
      order.grandTotal = this.priceSummary.grandTotal;;

      if (this.showTaxFlag) {
//        order.grandTotal = this.priceSummary.total + this.priceSummary.tax - this.priceSummary.discount;
        order.tax = this.priceSummary.tax.toFixed(2);
        orderSaveResponse.showTaxFlag = this.showTaxFlag;
      }
      else {
  //      order.grandTotal = this.priceSummary.total;
        order.tax = 0;
      }

      orderSaveResponse.taxCouponFlag=this.taxCouponFlag;


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

        orderItem.discount = items.discount; //items.discount;
        orderItem.unitPrice = this.getPrice(items);//items.unitPrice;
        orderItem.updatedBy = this.signInUser;
        orderItem.itemStatus = 'NEW';
        orderItem.agentId = items.loginId;
        orderItem.discountValue = items.discountVal;
        orderItem.taxAmount = items.totalTax;
        orderItem.totalPrice = items.totalPrice;

        orderSaveResponse.orderItems?.push(orderItem);

      });//this.cartDataList?.forEach((items)=>

      let len = orderSaveResponse.orderItems.length;
      orderSaveResponse.orders = order;
      //this.payment.orderId = orderId;
      this.payment.discount = this.priceSummary.discount;
      this.payment.taxesAmount = this.priceSummary.tax;
      this.payment.totalAmount = this.priceSummary.grandTotal;
      orderSaveResponse.payment = this.payment;

      this.orderService.saveOrder(orderSaveResponse).subscribe(data => {
        if (data != undefined) {
          let orderId = data.orders?.orderId;
          let orderNum = data.orders?.orderNum;
          if (orderId) {
            if (data.orders != null || data.orders != undefined) {
              let myOrder: Orders = data.orders;
              let items = data.orderItems;
              
              /*
              //Payment save
              this.payment.orderId = orderId;
              this.payment.discount = this.priceSummary.discount;
              this.payment.taxesAmount = this.priceSummary.tax;
              this.payment.totalAmount = this.priceSummary.grandTotal;
              this.paymentService.savePayment(this.payment).subscribe(data => {
                if (data != undefined) {
                  let resp = data.statusCode;
                }
              });
              */

              this.fbrInvoiceNumber = data.fbrInvoiceNumber;
              this.fbrQRCode = data.barcodeResp;

              let currentUser: any = sessionStorage.getItem('currentUser');
              let myCustomer: Customer = JSON.parse(currentUser);
              this.invoiceNumber = 'BL' + data.orders.invoiceNumber;

              this.todaydatashow = data.orders.createDate;
              localStorage.setItem('localCart', '');
              this.selectedAgent = new AdminUser();
              this.cache.set("selectedAgent", JSON.stringify(this.selectedAgent));


              Swal.fire('Submit', 'Order#' + orderNum + ' has been created.', 'success')
                .then((result) => {
                  if (result.isConfirmed) {
                    this.cache.set('reload', 'F');
                    this.printThermal();
      
                    // Reload the page
                    window.location.reload();
                  }
                });

                // const button = document.getElementById('{card-button}') as HTMLButtonElement;
                // button.disabled = false;  

//              window.location.reload();

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

    if (source === 'CASH') {
      if (this.result < this.priceSummary.grandTotal) {

        Swal.fire('WARNING', 'Payment is Not Enough', 'warning');
        return; // Don't proceed with saving
      }
    }

    this.payment.paymentMethod = source;
    this.payment.discount = this.priceSummary.discount;
    if (this.showTaxFlag) {
      this.payment.taxesAmount = this.priceSummary.tax;
    }
    else {
      this.payment.taxesAmount = 0;
    }

    this.payment.totalAmount = this.priceSummary.grandTotal;
    this.payment.currency = environment.currency;


    //This methods gets called from Guest Customer Data Entry form, when user click Checkout after entering his/her data.
    let customer = new Customer();
    customer = this.convertCustFormToVar(customer);

    if (this.customer.phone1 === undefined) {
      Swal.fire('WARNING', 'Please input Customer Phone Number', 'warning');
      return;
    }
    // else if (this.customer.phone1 === null) {
    //   Swal.fire('WARNING', 'Please input Customer Phone Number', 'warning');
    //   return;
    // }

    customer.firstName = 'POSCustomer';//this.customer.firstName;
    customer.email = 'info@techmaci.com';//this.customer.email;
    customer.phone1 = this.customer.phone1;
    customer.custType = 'C';
    customer.priority = 1;
    customer.loginPassword = '123';

    let customerRequest: CustomerRequest = new CustomerRequest();
    customerRequest = customer;

    //@@TODO: August 22, 2024
    //Check to see if POS user already exist in system, then don't save, this phone1 will be saved with Orders


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
    let popupWin;
    //let printContents:HTMLElement = (document.getElementById('print-section-0').innerHTML) as HTMLElement ;
    popupWin = window.open('', '_blank');
    if (popupWin != null || popupWin != undefined) {
      // popupWin.document.open();

      this.customer.firstName = 'POSCustomer';

      let orderAddress =
        this.customer?.address +
        ',' +
        this.customer?.city +
        ',' +
        this.customer?.stateProvince +
        ',' +
        this.customer?.postalCode;


      let mainImage = ``;
      if (this.appName === 'ZUBAIDA') {
        mainImage = `assets/images/logos/zubaida-color-logo.png`;
      }
      else if (this.appName === 'NIKS') {
        mainImage = `assets/images/logos/niks-logo-small.png`;
      }


      let myHtml01Tag = `
      <html> 
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge"> `;

      let styleTag = `
     <style>

.recipt_container
{
    width: 100% !important;
    max-width: 100mm;
    font-family: 'Poppins', sans-serif;
}

/* .tax
{
    display: none;
} */

.header
{
    text-align: center;
}
.header img
{
    width: 75%;
}

.float
{
    float: left;
}
.clear
{
    float: left;
    clear: both;
}

.company_details p
{
    font-size: 8pt;
    text-transform: uppercase;
    font-weight: 400;
    line-height: 11px;
}
.inv_details table
{
    font-size: 7pt;
    margin-left: auto;
    margin-right: auto;
    width: 95% !important;
    text-align: left;

}
.inv_details table th
{
    width: 50%;

}
.items table
{
    width: 98%;
    font-size: 7pt;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    border-collapse: collapse;


}
.items table thead tr, .items table tfoot tr
{
    border-top: 1pt solid black;
    border-bottom: 1pt solid black;
}
.items table tbody tr
{
    border-top: 0.9pt dotted black;
    border-bottom: 0.9pt dotted black;
}
.items table th:first-child{
   text-align: left;
}
.items table td:first-child{
    text-align: left;
}

.items table th:last-child{
    text-align: right;
 }
 .items table td:last-child{
     text-align: right;
 }

.totals table
 {
    width: 98%;
    font-size: 8pt;
    text-align: right;
    margin-right: 0px;
 }
 .totals table td:last-child
 {
     max-width: 30%;
 }
 .fbr
 {
     text-align: center;
 }
 .fbr_logo_0
 {
     width: 30mm;
     text-align: center;
 }
 .usin
 {
    width: 80%;
    max-height: 100px;
}

.fbr p
{
    font-size: 9pt;
    margin-top: 3px;
    margin-bottom: 3px;
    padding-left: 1%;
    padding-right: 1%;
}

.terms
{
    font-size: 8pt;
    text-align: center;
    padding-left: 1%;
    padding-right: 1%;
}

.copy
{
    font-size: 6pt;
    text-align: center;
}

.items table .inv_of td:last-child{
    text-align: center;
}

.logo
{
    margin-top: 5%;
    max-width: 100%;
    max-height: 100px;
}

.contact
{
    font-size: 7pt;
    text-align: center;
    padding-left: 1%;
    padding-right: 1%;
}

@media print {

    .recipt_container {
        page-break-after: always;

    }
        
    .page-break {
       page-break-before: always;
      }
        

}
    </style>`;

      let titleHtmlTag =
        `<title>Niks Receipt</title>
    </head>    
    <body  onload="window.print();window.close();">
    <div class="recipt_container">  
      <div class="header">
    	<img class="logo" src="` + mainImage + `" >`;


      let companyInfoHtmlTag = ``;

      if (this.showTaxFlag) {
        companyInfoHtmlTag = `	
        <div class="company_details">
    		  <p ><b> ABC SONS </b><br>
    			  <span class="strn">STRN:1700223239612|NTN:2232396-1</span>
    		  </p>
        </div>
      `;
      }
      else {
        companyInfoHtmlTag = `	
        <div class="company_details">
    		  <p ><b> Z GENERATIONS </b><br>
    			  <span class="strn">NTN:8057991-3</span>
    		  </p>
        </div>
      `;
      }

      let cardCash = '';
      if (this.payment.paymentMethod === 'CASH') {
        cardCash = `<tr>
          <td >Cash Paid:</td>
          <td colspan="5" style="text-align: left;">Rs. ` +
          (Number(this.result)).toFixed(2) +
          ` </td>
          </tr>`;

      }
      else if (this.payment.paymentMethod === 'CARD') {
        cardCash = `<tr>
          <td >Paid by Card</td>
          <td colspan="5" style="text-align: left;"> &nbsp;` +

          ` </td>
          </tr>`;

      }

      //myBottonHtml = myBottonHtml + cardCash +


      let myHtml02Tag = `
      <div class="inv_details">
    	  <p style="text-align:left; font-size: 7pt;"><b>Customer: ` + this.customer.firstName + `  (` + this.customer.phone1 + ` )` + `</b></p>
    	  <p style="text-align:left"><b>Date/Time:   &nbsp;` + this.todaydatashow + `</b></p>
      	<p style="text-align:left"><b> Bill#:` + this.invoiceNumber + `</b></p>
      </div>  
      <div class="items">
      `;

      let returnCart: CartHold = new CartHold();
      let saleCount = 0;
      let returnCount = 0;
      let returnTotal = 0;
      let returnTaxTotal = 0;
      let returnDiscountTotal = 0;
      let returnBeforeTaxTotal = 0;


      let saleTotal = 0;
      let saleTaxTotal = 0;
      let saleDiscountTotal = 0;
      let saleBeforeTaxTotal = 0;


      let myHtmlTableTag = `
      <table >
       
      <thead>
        <tr class="inv_of">
            <td colspan="7" style="text-align: center;border-top: 1px solid #000;"><b>---SALES---</b>
            </td>
        </tr>    

        <tr>
        <th>Barcode</th>
        <th>Price</th>
        <th>Qty</th>
        <th>Disc</th>` ;

      let taxItemTag = ``;
      if (this.showTaxFlag) {
        taxItemTag = `<th >Tax</th>
        <th >GST%</th>`;
      }

      myHtmlTableTag = myHtmlTableTag + taxItemTag +

        `<th >Total</th>
        </tr>
        <tr >
            <th colspan="6" >Description</th>
            <th></th>
        </tr>
      </thead>
      <tbody >
      
      `;

      let saleReturnString = 'SALES';
      let myHtmlItemHeadingTag = `
          <table >
       
          <thead>
            <tr class="inv_of">
                <td colspan="7" style="text-align: center;border-top: 1px solid #000;"><b>--- ` + saleReturnString + `---</b>
                </td>
            </tr>    

            <tr>
            <th>Barcode</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Disc</th>`;

      taxItemTag = ``;
      if (this.showTaxFlag) {
        taxItemTag = `<th >Tax</th>
            <th >GST%</th>`;
      }

      myHtmlItemHeadingTag = myHtmlItemHeadingTag + taxItemTag +


        ` <th >Total</th>
            </tr>
            <tr >
                <th colspan="6" >Description</th>
                <th></th>
            </tr>
          </thead>
          <tbody >
      `;


      let itemListHtmlTag = ``;
      let taxTdBlock = ``;
      let price: any = 0;

      for (let i = 0; i < this.cartDataList.product.length; i++) {
        price = (this.cartDataList.product[i].salePrice
          ? this.cartDataList.product[i].salePrice
          : this.cartDataList.product[i].unitPrice);


        if (this.cartDataList.product[i].quantity < 0) {
          //RETURNS
          returnCart.product.push(this.cartDataList.product[i]);
          returnCount += Number(this.cartDataList.product[i].quantity);

          //saleReturnString='RETURNS';
        }//if return items
        else {
          saleCount += Number(this.cartDataList.product[i].quantity);
          itemListHtmlTag = itemListHtmlTag +
            `<tr>
            <td>` +
            this.cartDataList.product[i].loginId + `-` + this.cartDataList.product[i].upc +
            `</td>
            <td>` +
            price.toFixed(2) +
            `</td>
            <td>` +
            this.cartDataList.product[i].quantity +
            `</td>
            <td>` +
            (this.cartDataList.product[i].discount === null ? 0 : this.cartDataList.product[i].discount) +
            `</td>`;
          saleBeforeTaxTotal += price;
          saleDiscountTotal += Number(this.cartDataList.product[i].discountVal);

          if (this.showTaxFlag) {
            saleTaxTotal = saleTaxTotal + this.cartDataList.product[i].totalTax;
            taxTdBlock = `<td><b>` +
              (this.cartDataList.product[i].totalTax).toFixed(2) +
              `</b></td>
            <td><b>` +
              this.cartDataList.product[i].tax +
              `</b></td>`;

          }
          else {
            taxTdBlock = ``;
          }

          saleTotal += Number(this.cartDataList.product[i].totalPrice);

          itemListHtmlTag += taxTdBlock +
            `<td><b>` +
            (Number(this.cartDataList.product[i].totalPrice)).toFixed(2) +
            `</b></td>
          </tr>
          <tr>
            <td colspan="7">` +
            this.cartDataList.product[i].productName +
            `</td>
             <td><td>
          </tr>
          `;

        }//else if SALE items


      } //for loop  

      itemListHtmlTag = itemListHtmlTag + `
      <tr>
            <td colspan="7" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>
      
      `;

      itemListHtmlTag = itemListHtmlTag + `
      <tr>
          <td colspan="7" style="border-top: 1pt solid black;"> &nbsp; </td> </tr> 
      </tr>
      <tr>
          <td colspan="1" > &nbsp;  </td> 
          <td><b>` + saleBeforeTaxTotal.toFixed(2) + `</b></td>
          <td><b>` + saleCount + `</b></td>
          <td><b>` + saleDiscountTotal.toFixed(2) + `</b></td>`;
      let showTaxHTML = ``;
      if (this.showTaxFlag) {
        showTaxHTML = `<td colspan="1">` + saleTaxTotal.toFixed(2) + ` </td>
        <td colspan="1"> &nbsp; </td>`;
      }
      else {
        showTaxHTML = `<td colspan="1"> &nbsp; </td>`;
      }

      itemListHtmlTag = itemListHtmlTag + showTaxHTML +
        `
          <td><b>` + saleTotal.toFixed(2) + `</b></td>
        </tr>
    
      `;
      itemListHtmlTag = itemListHtmlTag + `
    <tr>
          <td colspan="7" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>
    
    `;

      /* **************** Check for any RETURNS ***************** */
      let returnHTMLTag = ``;
      if (returnCart.product.length > 0) {
        //Change heading to RETURNS
        saleReturnString = 'RETURNS';
        returnHTMLTag =
          `<tr class="inv_of">
                <td colspan="7" style="text-align: center;border-top: 1px solid #000;"><b>--- ` + saleReturnString + `---</b>
                </td>
         </tr>
          <tr>
          <td colspan="7" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>   `;

        itemListHtmlTag = itemListHtmlTag + returnHTMLTag;

        for (let i = 0; i < returnCart.product.length; i++) {
          itemListHtmlTag = itemListHtmlTag +
            `<tr>
            <td>` +
            returnCart.product[i].loginId + `-` + returnCart.product[i].upc +
            `</td>
            <td>` +
            price.toFixed(2) +
            `</td>
            <td>` +
            returnCart.product[i].quantity +
            `</td>
            <td>` +
            (returnCart.product[i].discount === null ? 0 : returnCart.product[i].discount) +
            `</td>`;
          returnBeforeTaxTotal += price;
          returnDiscountTotal += Number(returnCart.product[i].discountVal);


          if (this.showTaxFlag) {
            returnTaxTotal += returnCart.product[i].totalTax;
            taxTdBlock = `<td><b>` +
              (returnCart.product[i].totalTax).toFixed(2) +
              `</b></td>
            <td><b>` +
              returnCart.product[i].tax +
              `</b></td>`;

          }
          else {
            taxTdBlock = ``;
          }

          returnTotal += Number(returnCart.product[i].totalPrice);
          itemListHtmlTag += taxTdBlock +
            `<td><b>` +
            (Number(returnCart.product[i].totalPrice)).toFixed(2) +
            `</b></td>
          </tr>
          <tr>
            <td colspan="7">` +
            returnCart.product[i].productName +
            `</td>
             <td><td>
          </tr>
          `;

        }//for loop RETURNS

      }

      /* *************** LOOP for Items ENDS ********************* */
      //Make return count +ve and return Total +ve

      if (returnCart.product.length > 0) {
        returnCount = returnCount * -1;
        //returnTotal = returnTotal * -1;

        itemListHtmlTag = itemListHtmlTag + `
          <tr>
              <td colspan="7" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>
          </tr>
          <tr>
              <td colspan="1" > &nbsp;  </td> 
              <td><b>` + returnBeforeTaxTotal.toFixed(2) + `</b></td>
              <td><b>` + returnCount + `</b></td>
              <td><b>` + returnDiscountTotal.toFixed(2) + `</b></td>`;

        showTaxHTML = ``;
        if (this.showTaxFlag) {
          showTaxHTML = `<td colspan="1">` + returnTaxTotal.toFixed(2) + ` </td>
          <td colspan="1"> &nbsp; </td>`;
        }
        else {
          showTaxHTML = `<td colspan="1"> &nbsp; </td>`;
        }
        itemListHtmlTag = itemListHtmlTag + showTaxHTML + `
              
              <td><b>` + returnTotal.toFixed(2) + `</b></td>
          </tr>
        
        `;
        itemListHtmlTag = itemListHtmlTag + `
        <tr>
            <td colspan="7" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>
        
        `;
      }


      let tableFooterHtmlTag = `
      </tbody>
        <tfoot>
        <tr>
        <td >Sub Total:</td>
        <td colspan="6" style="text-align: left;border-top: 1px solid #000;">Rs.` + (this.priceSummary.total).toFixed(2) + ` </td>
        
        </tr>
        <tr>
        <td style="text-align: left;">Total Qty:</td>
        <td colspan="5" style="text-align: left;"> ` +
        this.priceSummary.totalQty +
        `</td>
        </tr>
        <tr>
        <td >Discount:</td>
        <td colspan="5" style="text-align: left;">Rs.` + Math.round((Number(this.priceSummary.discount))).toFixed(2);  + ` </td>
        </tr> `

      let taxItemTRTag = ``;
      if (this.showTaxFlag) {
        taxItemTRTag = `<tr>
          <td >Tax:</td>
          <td colspan="5" style="text-align: left;">Rs.` + (this.priceSummary.tax).toFixed(2) + ` </td>
          </tr>`;

      }
      tableFooterHtmlTag = tableFooterHtmlTag + taxItemTRTag +
        `<tr> 
          <td ><b>Total: </b></td>
          <td colspan="5" style="text-align: left;"><b>Rs.` + (this.priceSummary.grandTotal).toFixed(2) + `</b> </td>
          </tr>` + cardCash + `
          <tr>
        <td style="text-align: left;border-bottom: 1px solid #000;" ><b>Customer Balance: </b></td>
        <td colspan="5" style="text-align: left;border-bottom: 1px solid #000;"><b>Rs.` + (this.customerBalance).toFixed(2) + `</b> 
        </td>
        
            </tfoot>
        </table>
      
      `;

      //<img style="width:30mm;" src="assets/images/FBR_QRReceipt.png" >


      let fbrHtmlTag = `
      <div class="tax fbr" style="display: block;">          
  
        <img src="assets/images/barcode.jpg" id="imagea" class="usin fbr">
        <p>FBR Invoice#: ` + this.fbrInvoiceNumber + `</p>
        <div class="fbr_logo">
        <img style="width:30mm;" src="assets/images/fbr.png"  alt="We are integrated with FBR">
        <img style="width:6.5rem; height:6.5rem"  src='data:` + this.fbrQRCode.imageType + ` ;base64,` + this.fbrQRCode.image + `'
          alt="Card image cap">
        </div>
          <p>
                   <em>Verify your invoice through FBR Tax Asaan Mobile App
                    or SMS at 9966 and win exciting prizes in draw.</em>
          </p>
        
      </div>

      `;

      let contactHtmlTag = ``;
      if (this.appName === 'ZUBAIDA') {
        contactHtmlTag = `
        <div class="contact">
          <p>If you have any queries related, feel free to reach us at: <br>
              <i class="fa fa-fw fa-phone"></i>+92 300 3932177 +92 21 37293088><br>
              <i class="fa fa-fw fa-envelope"></i>info@bebekingdom.pk<br>
              <i class="fa fa-fw fa-map-pin"></i> Shop#1, Chawla Center, P.E.C.H.S, Block 2, Tariq Road, Karachi
          </p>
        </div>
      `;
      }
      else if (this.appName === 'NIKS') {
        contactHtmlTag = `
        <div class="contact">
          <p>If you have any queries related, feel free to reach us at: <br>
              <i class="fa fa-fw fa-phone"></i>+92 300 3932177 +92 21 37293088><br>
              <i class="fa fa-fw fa-envelope"></i>info@niksonline.pk<br>
              <i class="fa fa-fw fa-map-pin"></i> Building 119, Y Block, DHA Phase 3, Lahore
          </p>
        </div>
      `;
      }




      let termHtmlTag = `
      <div class="terms">
        <p>
          <b>**Terms &amp; Conditions**</b>
                                        <br>
                                        Items once sold are exchangeable/replaceable within 3 days. All items must be
                                        returned is in original form (unused, unworn, original packaging, seals, and
                                        tags attached), along with all accessories, manuals, and warranty card that came
                                        with it.
                                        <br>
                                        Items <b>SOLD ON SALE</b> are <b>NOT</b> exchangeable or replaceable.
                                        <br>
                                        <b>PAYMENTS MADE ON CARD</b> are <b>NOT</b> exchangeable or replaceable.
                                        <br>
                                         GST is exclusive of pricing 
        </p>
      </div>
      `;

      let lastHtmlTag = `
      <p style="margin-left:30px !important;">
        	<b>Thanks for your purchase!</b>
      </p>
       
      </div>
       
    
      </body>
    </html>
      `;


      let finalHTMLTag = ``;
      //Add all hmt tags
      if (this.showTaxFlag) {
        finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + fbrHtmlTag + contactHtmlTag + termHtmlTag + lastHtmlTag;
      }
      else {
        finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + contactHtmlTag + termHtmlTag + lastHtmlTag;
      }



      //Initializae payment object after save
      this.payment = new Payment();

      ///////////////////////////////////////////////////////////////////////////
      //1st copy
      popupWin.document.write(finalHTMLTag);
      
      ///////////////////////////////////////////////////////////////////////////
      //2nd copy

      if (this.showTaxFlag) {
        finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + fbrHtmlTag +  lastHtmlTag;
      }
      else {
        finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag +  lastHtmlTag;
      }
      finalHTMLTag = '<div class="page-break"></div> ' + finalHTMLTag;
      
      popupWin.document.write(finalHTMLTag);
      ///////////////////////////////////////////////////////////////////////////

      //  const phoneNumber = '+923213967330'; // Replace with the recipient's phone number including country code
      //  const message = encodeURIComponent(finalHTMLTag);
      //  const whatsappUrl = `https://web.whatsapp.com/${phoneNumber}?text=${message}`;

      //  window.location.href = whatsappUrl;


      popupWin.document.close();

    }//popupWin

  }

  /* ******************************************************************************** */

  printThermalOld(): void {
    /* Must open Chrome in KIOSK mode */
    /* "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk-printing */

    let popupWin;
    //let printContents:HTMLElement = (document.getElementById('print-section-0').innerHTML) as HTMLElement ;
    popupWin = window.open('', '_blank');
    if (popupWin != null || popupWin != undefined) {
      // popupWin.document.open();

      this.customer.firstName = 'POSCustomer';

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
    <div class="ticket">  ` ;


      if (this.appName === 'ZUBAIDA') {
        myBodyOrder = myBodyOrder + `<img src="assets/images/logos/zubaida-color-logo.png" id="imagea" width: 20mm; text-align: center; ">`;
      }
      else if (this.appName === 'NIKS') {
        myBodyOrder = myBodyOrder + `<img src="assets/images/logos/niks-logo-small.png" id="imagea" width: 20mm; text-align: center; ">`;
      }


      let tHead = '';
      if (this.showTaxFlag) {
        tHead =
          `<thead>
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
      </thead>`
      }
      else {
        tHead =
          `<thead>
        <tr >
            <td colspan="6" style="text-align: left;border-top: 1px solid #000;"><b>Product Description</b></td>
        </tr>
        <tr >
        <td style="text-align: left;border-top: 1px solid #000;"><b>Price</b></td>
        <td style="text-align: left;border-top: 1px solid #000;" ><b>Qty</b></td>
        <td style="text-align: left;border-top: 1px solid #000;" ><b>Discount</b></td>
        <td style="text-align: left;border-top: 1px solid #000;"><b>Total</b></td>
        </tr>
      </thead>`
      }




      myBodyOrder = myBodyOrder +
        `<p style="text-align:left !important;"><b> ABC SONS </b><br>
    STRN:1700223239612|NTN:2232396-1</p>
 
    <h1 style="font-size:13px;text-align:left !important;"><b>Sale Receipt </b></h1>
    <h1 style="font-size:13px;text-align:left !important;"><b> Customer: &nbsp;` +
        this.customer.firstName + `  (` + this.customer.phone1 + ` )` +
        `</b></h1>` +
        `<h1 style="font-size:13px;text-align:left !important;"><b> Date/Time: ` +
        this.todaydatashow + `</b></h1>` +

        `<h1 style="font-size:13px;text-align:left !important;"><b> Bill#:: ` +
        this.invoiceNumber + `</b></h1>` +


        `<table style="list-style:none;font-size:12px;text-align:left; ">` +
        tHead +
        `<tbody >`;




      let myItems = ``;
      let subtotal = 0;
      let taxItem = 0;
      let totalTax = 0;
      let FbrCharges = 0;
      let total = 0;
      let itemDiscount = 0;

      for (let i = 0; i < this.cartDataList.product.length; i++) {
        let price = (this.cartDataList.product[i].salePrice
          ? this.cartDataList.product[i].salePrice
          : this.cartDataList.product[i].unitPrice)

        taxItem = this.cartDataList.product[i].totalTax; //this.getItemTax(this.cartDataList.product[i], i);
        if (this.showTaxFlag) {
          total = subtotal - this.totalDiscount + taxItem;
        }
        else {
          total = subtotal - this.totalDiscount;
        }

        let discountPrice = 0;

        //totalTax = totalTax + taxItem;
        price = price * this.cartDataList.product[i].quantity; //660
        if (this.cartDataList.product[i].discountVal > 0) {
          itemDiscount = this.cartDataList.product[i].discountVal;
          discountPrice = this.cartDataList.product[i].discountVal;
        }
        else {
          itemDiscount = this.cartDataList.product[i].discount;//%age
          discountPrice = (price * itemDiscount) / 100;
        }


        if (itemDiscount === null) {
          itemDiscount = 0;
        }



        let taxTdBlock = '';



        myItems +=
          `<tr>
            <td colspan="6" style="text-align: left;border-top: 1px solid #000;"><b>` +
          this.cartDataList.product[i].loginId + `-` + this.cartDataList.product[i].productName + `( ` + this.cartDataList.product[i].upc + ` )` +
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
          //itemDiscount +
          this.cartDataList.product[i].discount +
          `</b></td>`;


        if (this.showTaxFlag) {
          taxTdBlock = `<td><b>` +
            //itemTax +
            this.cartDataList.product[i].totalTax +
            `</b></td>
            <td><b>` +
            this.cartDataList.product[i].tax +
            `</b></td>`;

        }
        else {
          taxTdBlock = ``;
        }

        myItems += taxTdBlock +

          `<td><b>` +
          //totalPrice +
          this.cartDataList.product[i].totalPrice +
          `</b></td>
        </tr>`;
      }


      let mySubTotal = Math.round(Number(this.priceSummary.total)).toFixed(2);
      let myDiscount = Math.round((Number(this.totalDiscount))).toFixed(2);
      let myTax = Math.round((Number(this.priceSummary.tax))).toFixed(2);
      let fbrPos = (Number(this.FbrCharges)).toFixed(2);
      let myTotal = Math.round((Number(this.priceSummary.grandTotal))).toFixed(2);
      let myTotalQty = this.priceSummary.totalQty; //this.calculateQtyTotal(this.cartDataList);

      let finalTaxBlock = ``;
      let myBottonHtml =
        `</tbody>
        <tfoot>
        <tr>
        <td style="text-align: left;border-top: 1px solid #000;">Sub Total:</td>
        <td colspan="5" style="text-align: left;border-top: 1px solid #000;">Rs. ` +
        mySubTotal +
        ` </td>
        </tr>
        <tr>
        <td style="text-align: left;">Total Qty:</td>
        <td colspan="5" style="text-align: left;"> ` +
        myTotalQty +
        ` </td>
        </tr>

        <tr>
        <td >Discount:</td>
        <td colspan="5" style="text-align: left;">Rs. ` +
        myDiscount +
        ` </td>
        </tr>` ;

      if (this.showTaxFlag) {
        finalTaxBlock = ` 
            <tr>
              <td >Tax:</td>
              <td colspan="5" style="text-align: left;">Rs. ` +
          myTax +
          ` </td>
            </tr>`;
      }

      myBottonHtml = myBottonHtml + finalTaxBlock +

        `<tr> 
          <td ><b>Total: </b></td>
          <td colspan="5" style="text-align: left;"><b>Rs ` +
        myTotal +
        `</b> </td>
          </tr>`;

      let cardCash = ``;

      if (this.payment.paymentMethod === 'CASH') {
        cardCash = `<tr>
          <td >Cash Paid:</td>
          <td colspan="5" style="text-align: left;">Rs. ` +
          this.result +
          ` </td>
          </tr>`;

      }
      else if (this.payment.paymentMethod === 'CARD') {
        cardCash = `<tr>
          <td >Paid by Card</td>
          <td colspan="5" style="text-align: left;"> &nbsp;` +

          ` </td>
          </tr>`;

      }

      myBottonHtml = myBottonHtml + cardCash +

        `<tr>
        <td style="text-align: left;border-bottom: 1px solid #000;" ><b>Customer Balance: </b></td>
        <td colspan="5" style="text-align: left;border-bottom: 1px solid #000;"><b>Rs ` +
        (this.customerBalance).toFixed(2) +
        `</b> 
        </td>
        
        </tr>
        </tfoot>
        </table>
        
        
        
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
       
       <img src="assets/images/barcode.jpg" >




       
       
   </div>
        <p style="margin-left:30px !important;">
        <b>Thanks for your purchase!</b>
        </p>
    
  </body>
  </html>`;

      // <p id="abc" class="centered" style="font-size:small;margin-left:10px !important;">
      // Copyright© 2024 Z GENERATIONS. </p>
      // <p id="abc" style="font-size:7px;">
      // All rights Reserved to Software Developed By <b id="abcc">TechMaci</b>
      // <br> 
      // Ph +92 300-3932177 | Cell +92 21 37293088 
      // </p>


      let myFinalHtml = myHtml + myBodyOrder + myItems + myBottonHtml;
      //alert(myFinalHtml);

      //Initializae payment object after save
      this.payment = new Payment();

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
    //let invoiceTotal = Number(this.priceSummary.total) || 0;


    if (this.showTaxFlag) {
      this.customerBalance = (this.priceSummary.total - cashDiscount + this.priceSummary.tax);
    }
    else {
      this.customerBalance = (this.priceSummary.total - cashDiscount);
    }



    this.priceSummary.grandTotal = this.customerBalance;
    this.priceSummary.grandTotal = Math.round(Number(this.priceSummary.grandTotal))

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
  show() {
    this.mobileshow = false;
  }

  hide() {
    this.mobileshow = true;

  }

  uploadSale() {
    //step-1: find out the list of orders+orderItems generated for current date
    //step-2: Pass this list of orders+orderItems to cloud API
    let orderSaveResponseArray: OrderResponse;
    this.spinnerDataLoad = true;
    this.orderService.getTodaysOrders().subscribe((data: OrderResponse) => {
      if (data !== undefined) {

        this.errorsFlag = false;

        //this.orderList=data.orderCustomer;
        //this.orderItemWrapperList=data.orderItems;
        orderSaveResponseArray = data;


        if (data.orderCustomer !== null || data.orderCustomer != undefined) {
          this.orderService.uploadSales(orderSaveResponseArray)
            .subscribe((data1: ApiResponse) => {
              if (data1 != undefined) {
                if (data1.statusCode == 0) {
                  Swal.fire('Submit', ' Succesfully Uploaded Sales!', 'success');

                }
                else {
                  Swal.fire('Submit', ' Uploaded Sales Fail', 'error');
                }
              }
              this.spinnerDataLoad = false;
            });


        }
      }

    });



  }
  downloadProductsOld() {
    //step-1: Get max productId from localhost DB
    //step-2: Pass this max productId to Cloud bases API
    //If there are new products added in Cloud, Cloud API will return a list of products
    //Step-4: Add these products to localhost DB 

    if (this.cloudAPIUrl === this.myUrl) {

      return;
    }


    let maxProductId: number;
    //step-1: Get Max Product Id from Local DB
    this.productService.getMaxProductId().subscribe((data: number) => {
      maxProductId = data;

      if (maxProductId == 0) return;

      //step-2: Get List of Products from Cloud where productId>maxProductId(local)
      this.productService.getProductMissingLocal(maxProductId).subscribe(
        (data1: ProductWrapper) => {
          if (data1 === undefined) return;
          if (data1.productList.length === 0) return;
          //Step-3: Save Missing products in Local DB
          this.productService.saveProductListToLocalDB(data1.productList).subscribe(
            (data2: ApiResponse) => {
              if (data2 != undefined) {
                if (data2.statusCode == 0) {
                  Swal.fire('Submit', ' Succesfully Added Products!', 'success');

                }
              }
            }
          );

        }
      );


    });

  }
  /* ************************************************************ */
  downloadProducts() {
    //step-1: Get last updated date from db_update table for table_name product from localhost DB
    //step-2: Pass this last update date to Cloud bases API
    //If there are new products added/updated in Cloud, Cloud API will return a list of products, new and old items
    //Step-4: Add/update these products to localhost DB 

    if (this.cloudAPIUrl === this.myUrl) {

      return;
    }

    let lastUpdateDate: any;
    this.spinnerDataLoad = true;
    //Step-1: Get last updated date from db_update table for table_name product from localhost DB
    this.productService.getLastUpdateDate().subscribe((data: DbUpdate) => {
      lastUpdateDate = data;
      if (lastUpdateDate !== undefined) {
        //Step-2: Pass this last update date to Cloud bases API
        this.productService.getProductsUpdatedInCloud(lastUpdateDate).subscribe(
          (data1: ProductWrapper) => {
            if (data1 === undefined) {
              this.spinnerDataLoad = false; 
              Swal.fire('Submit', ' Error in Download Items', 'error');
              return;}
            if (data1.productList.length === 0) {
              this.spinnerDataLoad = false; 
              Swal.fire('Submit', ' No Products to update!', 'success');
              return;
            }
            //Step-3: Save Missing products in Local DB
            this.productService.saveProductListToLocalDB(data1.productList).subscribe(
              (data2: ApiResponse) => {
                if (data2 != undefined) {
                  if (data2.statusCode == 0) {
                    let len = data1.productList.length;
                    Swal.fire('Submit', ' Succesfully Added/Updated ' + len + ' Items!', 'success');

                  }
                  this.spinnerDataLoad = false;
                }
              }
            );

          }
        );

      }//endif

    });
  }



  /* ************************************************************ */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let t1 = 0;
    if (event.ctrlKey) return;
    if (event.altKey) return;
    switch (event.key) {
      case 'F2':
        this.openProductSearchPopup();
        break;
      case 'F9':
        //alert('cash sale for F3');
        this.openCashModal();
        break;
      case 'F4':
        //alert('hold sale for F4');
        this.checkHoldSale();
        break;

      case 'F5':
        //alert('card sale for F5');
        this.openCardModal();
        break;
      case 'F8':
        //alert('daily sale for F8');
        this.dailySale();
        break;
      case 'F6':
        this.openPriceCheckPopup();
        break;
      case '=':
        if (this.cashModal) {
          this.calculate();
        }
        break;
      case 'Enter':
        if (this.cashModal) {
          this.onCustomerSave('CASH');
        }
        else {
          //alert(event.key)
          //this.upcSearch(event);
        }
        break;
      case 'keydown':
        break;
      case 'Backspace':
        if (this.cashModal) {
          this.backSpace();
        }
        
        break;
      case 'Delete':
        if (this.cashModal) {
        this.backSpace();
        }
        break;
      case 'Escape':
        this.closeCashModal();
        if (this.priceCheckPopup) {
          this.closeModal();
        }
        if (this.productSearchPopup) {
          this.closeProductSearchPopup();
        }
        break;
      case '.':
        if (this.cashModal) {
          this.appendToResult(event.key);
        }
        break;
      default:
        if (this.cashModal) {
          let numVal = Number(event.key);
          if (numVal !== null) {
            if (numVal >= 0 || numVal <= 9) {
              //this.appendToResult(event.key);
            }
          }

        }
        break;

    }
  }

  agentChange() {
    this.selectedAgent;
    this.cache.set("selectedAgent", JSON.stringify(this.selectedAgent));


  }

  agentKey(event: any) {
    if (event.key === 'Enter') {
      let agentInput = <HTMLInputElement>document.getElementById('selectAgentInput');
      if (agentInput === undefined) {
        return;
      }
      let agent = agentInput.value;
      if (agent !== undefined || agent !== '') {
        for (let i = 0; i < this.salesAgentList.length; i++) {
          if (this.salesAgentList[i].loginId === agent) {
            this.selectedAgent = this.salesAgentList[i];

            this.cache.set("selectedAgent", JSON.stringify(this.selectedAgent));



          }
        }//for loop
        this.focusUpc(true);
      }
    }
  }
  /* **************************************************** */
  customerPhoneKey(event: any) {

    if (event.key === 'Enter') {
      let selectedPhoneInput = <HTMLInputElement>document.getElementById('selectedPhoneInput');
      if (selectedPhoneInput === undefined) {
        return;
      }
      let phone = selectedPhoneInput.value;
      if (phone !== undefined || phone !== '') {
        this.focusAgent(true);

      }
    }
  }

  focusAgent(focusFlag: boolean) {
    let agentInput = <HTMLInputElement>document.getElementById('selectAgentInput');
    if (focusFlag) {
      agentInput.focus();
    }
    else {
      //upcInput.focus();
    }

    agentInput.autofocus = focusFlag;

  }


  focusUpc(focusFlag: boolean) {
    let upcInput = <HTMLInputElement>document.getElementById('upc-search');
    if (focusFlag) {
      upcInput.focus();
    }
    else {
      //upcInput.focus();
    }

    upcInput.autofocus = focusFlag;

  }
  /* ************************************************************* */
  priceChange(row: number) {

    let priceInput = <HTMLInputElement>document.getElementById('price_' + row);
    

    let val = priceInput.value;
    let priceVal: any;
    if (priceInput.value !== null) {
      priceVal = Number(priceInput.value);
    }

    if (priceInput != null || priceInput != undefined) {
      let len = priceInput.value.length;

      let discount = Number(val);
      if (discount < 0) {
        //0 or below not allowed
        Swal.fire('WARNING', '0 or negative price is not allowed', 'warning');
        return;

      }
     
    }

    this.cartDataList.product[row].price = priceInput.value;
    let price = priceInput.value;

    
    //price = price * this.cartDataList.product[row].quantity;

    //discountVal = Number((Number(discountInput.value) * price) / 100);

    let localCartData = localStorage.getItem('localCart');
    if (localCartData) {
      let discountData = JSON.parse(localCartData);
      discountData.product[row].price = priceInput.value;
      localStorage.setItem('localCart', JSON.stringify(discountData))


    }


    this.priceCalculationPerRow(row);
    this.priceCalculationTotal();
    this.productService.localAddToCart(this.cartDataList);

    this.focusUpc(true);

    //Commented out on August 19
    //window.location.reload();


  }


  /* ************************************************************* */
  discountChange(row: number) {

    let discountInput = <HTMLInputElement>document.getElementById('discount_' + row);
    let discountValInput = <HTMLInputElement>document.getElementById('discount_val_' + row);

    let val = discountInput.value;
    let discountVal: any;
    if (discountValInput.value !== null) {
      discountVal = Number(discountValInput.value);
    }

    if (discountInput != null || discountInput != undefined) {
      let len = discountInput.value.length;

      let discount = Number(val);
      if (discount < 0) {
        //0 or below not allowed
        Swal.fire('WARNING', '0 or negative discount is not allowed', 'warning');
        return;

      }
      if (len > 2) {
        discountInput.value = discountInput.value.toString().slice(0, 2);
      }
    }

    this.cartDataList.product[row].discount = discountInput.value;
    let price = this.getPrice(this.cartDataList.product[row]);
    //  (this.cartDataList.product[row].salePrice
    //   ? this.cartDataList.product[row].salePrice
    //   : this.cartDataList.product[row].unitPrice)

    price = price * this.cartDataList.product[row].quantity;

    discountVal = Number((Number(discountInput.value) * price) / 100);

    let localCartData = localStorage.getItem('localCart');
    if (localCartData) {
      let discountData = JSON.parse(localCartData);
      discountData.product[row].discount = discountInput.value;
      discountData.product[row].discountVal = discountVal;
      localStorage.setItem('localCart', JSON.stringify(discountData))


    }
    this.cartDataList.product[row].discount = discountInput.value;
    this.cartDataList.product[row].discountVal = discountVal;


    this.priceCalculationPerRow(row);
    this.priceCalculationTotal();
    this.productService.localAddToCart(this.cartDataList);

    this.focusUpc(true);

    //Commented out on August 19
    //window.location.reload();


  }

  /* ************************************************************* */
  discountValChange(row: number) {


    let discountValInput = <HTMLInputElement>document.getElementById('discount_val_' + row);
    let discountInput = <HTMLInputElement>document.getElementById('discount_' + row);

    let discountVal: any;
    if (discountValInput.value !== null) {
      discountVal = Number(discountValInput.value);
    }
    let price = (this.cartDataList.product[row].salePrice
      ? this.cartDataList.product[row].salePrice
      : this.cartDataList.product[row].unitPrice)


    price = price * this.cartDataList.product[row].quantity;

    let localCartData = localStorage.getItem('localCart');
    if (localCartData) {
      let discountData = JSON.parse(localCartData);
      discountData.product[row].discountVal = discountVal;
      let discountPercentage = (discountVal * 100) / price;

      discountData.product[row].discount = discountPercentage.toFixed(2);
      this.cartDataList.product[row].discountVal = discountVal;
      discountInput.value = discountPercentage.toFixed(2);

      localStorage.setItem('localCart', JSON.stringify(discountData))
    }

    //discountVal = Number((Number(discountInput.value) * price) / 100);
    this.cartDataList.product[row].discount = discountInput.value;
    this.cartDataList.product[row].discountVal = discountVal;

    this.priceCalculationPerRow(row);
    this.priceCalculationTotal();
    this.productService.localAddToCart(this.cartDataList);

    this.focusUpc(true);

    //window.location.reload();
  }
  /* ************************************************************** */
  chkPriceNumber1(row: number) {
    let priceInput = <HTMLInputElement>document.getElementById('price_' + row);
    
    let val = priceInput.value;

    if (priceInput != null || priceInput != undefined) {
      let len = priceInput.value.length;

      let qty = Number(val);
      if (qty < 0) {
        //0 or below not allowed
        Swal.fire('WARNING', 'Negative Price is not allowed', 'warning');
        return;

      }
     
    }
  } //chkNumber


  /* ************************************************************** */
  chkDiscountNumber1(row: number) {
    let discountInput = <HTMLInputElement>document.getElementById('discount_' + row);
    let discountValInput = <HTMLInputElement>document.getElementById('discount_val_' + row);
    let val = discountInput.value;

    if (discountInput != null || discountInput != undefined) {
      let len = discountInput.value.length;

      let qty = Number(val);
      if (qty < 0) {
        //0 or below not allowed
        Swal.fire('WARNING', 'Negative discount is not allowed', 'warning');
        return;

      }
      if (len > 2) {
        discountInput.value = discountInput.value.toString().slice(0, 2);
      }

      discountValInput.value = this.calculateDiscount(discountInput.value, row);
    }
  } //chkNumber
  /* ************************************************************* */
  calculateDiscount(discount: any, row: any): any {

    let price = this.cartDataList.product[row].price * this.cartDataList.product[row].quantity;
    let discountVal = 0;

    if (discount===undefined){
      discount=0;
    }

    discountVal = (discount * price) / 100;
    this.cartDataList.product[row].discountVal = discountVal;

    return discountVal;
  }



  /* ************************************************************* */
  openProductSearchPopup() {
    this.productSearchPopup = true;
  }

  closeProductSearchPopup() {
    this.productSearchPopup = false;
    this.productcheckList = [];
    this.clearProductSearchFields();
  }

  /* ************************************************************** */
  clearProductSearchFields() {
    // Clear the priceCheck property in the component
    let nameInput = document.getElementById(
      'name-search'
    ) as HTMLInputElement; // Get the input element

    if (nameInput) {
      nameInput.value = ''; // Reset the input field value
    }

    let skuInput = document.getElementById(
      'sku-search'
    ) as HTMLInputElement; // Get the input element

    if (skuInput) {
      skuInput.value = ''; // Reset the input field value
    }

    let priceInput = document.getElementById(
      'price-search'
    ) as HTMLInputElement; // Get the input element

    if (priceInput) {
      priceInput.value = ''; // Reset the input field value
    }

    //Empty the List
    this.productcheckList = [];
  }


  selectSearchProduct(product: ProductView) {

    if (this.selectedAgent?.loginId === undefined || this.selectedAgent?.loginId === '') {
      Swal.fire('Agent Required', 'Please select an Agent', 'warning');
      return;
    }

    this.commonAdditionToCart(product);

    /*
    let localCartData = localStorage.getItem('localCart');
    if (localCartData) {
      let cartData = JSON.parse(localCartData);
      product.quantity = 1;
      product.loginId = this.selectedAgent?.loginId;
      product.firstName = this.selectedAgent?.firstName;
      product.agentId = this.selectedAgent?.userId;
      product.price = this.getPrice(product);
      product.totalPrice = 0;
      product.totalTax = 0;
      //@TODO Commented out on 2024-09-06
      // product.discount = 0;
      // product.discountVal = 0;
      if (product.tax === null) {
        product.tax = 18;
      }


      cartData.product.push(product);
      localStorage.setItem('localCart', JSON.stringify(cartData));
    }
    else {
      product.quantity = 1;
      product.loginId = this.selectedAgent?.loginId;
      product.firstName = this.selectedAgent?.firstName;
      product.agentId = this.selectedAgent?.userId;
      product.price = this.getPrice(product);
      product.totalPrice = 0;
      product.totalTax = 0;
       //@TODO Commented out on 2024-09-06
      // product.discount = 0;
      // product.discountVal = 0;
      if (product.tax === null) {
        product.tax = 18;
      }

      this.cartDataList.product.push(product);
      localStorage.setItem('localCart', JSON.stringify(this.cartDataList));
    }
*/
    this.closeProductSearchPopup();
    //window.location.reload();

  }

  dailySale() {
    this.router.navigate(['reports']);
  }

  lastBillOfSale() {


    this.orderService.getLastBillOfSale().subscribe((data: OrderResponse) => {
      if (data !== undefined) {

        let orderCustomer = data.orderCustomer;
        let orders: any = new Orders();
        if (data.orderCustomer.length > 0) {
          orders = data.orderCustomer[0].orders;
          let customer: any = data.orderCustomer[0]?.customer;
          let orderItems = data.orderItems;

          this.printThermalLastBill(orders, customer, orderItems);

        }


      }

    });


  }
  /* ******************************************************************************************************* */
  printThermalLastBill(order: Orders, customer: Customer, orderItems: OrderItemProductWrapper[]) {
    let popupWin;
    //let printContents:HTMLElement = (document.getElementById('print-section-0').innerHTML) as HTMLElement ;
    popupWin = window.open('', '_blank');
    if (popupWin != null || popupWin != undefined) {
      // popupWin.document.open();

      this.customer = customer;


      let mainImage = ``;
      if (this.appName === 'ZUBAIDA') {
        mainImage = `assets/images/logos/zubaida-color-logo.png`;
      }
      else if (this.appName === 'NIKS') {
        mainImage = `assets/images/logos/niks-logo-small.png`;
      }


      let myHtml01Tag = `
    <html> 
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <style>

.recipt_container
{
  width: 100% !important;
  max-width: 100mm;
  font-family: 'Poppins', sans-serif;
}

/* .tax
{
  display: none;
} */

.header
{
  text-align: center;
}
.header img
{
  width: 75%;
}

.float
{
  float: left;
}
.clear
{
  float: left;
  clear: both;
}

.company_details p
{
  font-size: 8pt;
  text-transform: uppercase;
  font-weight: 400;
  line-height: 11px;
}
.inv_details table
{
  font-size: 7pt;
  margin-left: auto;
  margin-right: auto;
  width: 95% !important;
  text-align: left;

}
.inv_details table th
{
  width: 50%;

}
.items table
{
  width: 98%;
  font-size: 7pt;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  border-collapse: collapse;


}
.items table thead tr, .items table tfoot tr
{
  border-top: 1pt solid black;
  border-bottom: 1pt solid black;
}
.items table tbody tr
{
  border-top: 0.9pt dotted black;
  border-bottom: 0.9pt dotted black;
}
.items table th:first-child{
 text-align: left;
}
.items table td:first-child{
  text-align: left;
}

.items table th:last-child{
  text-align: right;
}
.items table td:last-child{
   text-align: right;
}

.totals table
{
  width: 98%;
  font-size: 8pt;
  text-align: right;
  margin-right: 0px;
}
.totals table td:last-child
{
   max-width: 30%;
}
.fbr
{
   text-align: center;
}
.fbr_logo_0
{
   width: 30mm;
   text-align: center;
}
.usin
{
  width: 80%;
  max-height: 100px;
}

.fbr p
{
  font-size: 9pt;
  margin-top: 3px;
  margin-bottom: 3px;
  padding-left: 1%;
  padding-right: 1%;
}

.terms
{
  font-size: 8pt;
  text-align: center;
  padding-left: 1%;
  padding-right: 1%;
}

.copy
{
  font-size: 6pt;
  text-align: center;
}

.items table .inv_of td:last-child{
  text-align: center;
}

.logo
{
  margin-top: 5%;
  max-width: 100%;
  max-height: 100px;
}

.contact
{
  font-size: 7pt;
  text-align: center;
  padding-left: 1%;
  padding-right: 1%;
}

@media print {

  .recipt_container {
      page-break-after: always;

  }

}


  </style>
    
  <title>Niks Receipt</title>
  </head>    
  <body  onload="window.print();window.close();">
  <div class="recipt_container">  
    <div class="header">
    <img class="logo" src="` + mainImage + `" >
  
    <div class="company_details">
      <p ><b> ABC SONS </b><br>
        <span class="strn">STRN:1700223239612|NTN:2232396-1</span>
      </p>
    </div>
    
    
    `;



      let myHtml02Tag = `
    <div class="inv_details">
      <p style="text-align:left"><b>Customer: ` + this.customer.firstName + `  (` + this.customer.phone1 + ` )` + `</b></p>
      <p style="text-align:left"><b>Date/Time:   &nbsp;` + order.createDate + `</b></p>
      <p style="text-align:left"><b> Bill#:` + order.orderId + `</b></p>
    </div>  
    <div class="items">
    `;

      let myHtmlTableTag = `
        <table >
     
  <thead>
      <tr class="inv_of">
          <td colspan="7" style="text-align: center;border-top: 1px solid #000;"><b>---SALES---</b>
          </td>
      </tr>    

      <tr>
      <th>Barcode</th>
      <th>Price</th>
      <th>Qty</th>
      <th>Disc</th>
      <th >Tax</th>
      <th >GST%</th>
      <th >Total</th>
      </tr>
      <tr >
          <th colspan="6" >Description</th>
          <th></th>
      </tr>
    </thead>
    <tbody >
    
    `;

      let myHtmlItemHeadingTag = `
        <table >
     
        <thead>
          <tr class="inv_of">
              <td colspan="7" style="text-align: center;border-top: 1px solid #000;"><b>---SALES---</b>
              </td>
          </tr>    

          <tr>
          <th>Barcode</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Disc</th>
          <th >Tax</th>
          <th >GST%</th>
          <th >Total</th>
          </tr>
          <tr >
              <th colspan="6" >Description</th>
              <th></th>
          </tr>
        </thead>
        <tbody >
    `;


      let itemListHtmlTag = ``;
      let taxTdBlock = ``;
      let price: any = 0;
      let totalQty = 0;
      let totalDiscount = 0;

      for (let i = 0; i < orderItems.length; i++) {
        price = orderItems[i].ordersItems?.unitPrice;
        let quantity: any = orderItems[i].ordersItems?.quantity;//1
        let discount = orderItems[i].ordersItems?.discount;//%age 10

        let discountVal = price - (price * discount) / 100;//52
        let taxItem = ((orderItems[i].products?.tax) * (quantity * discountVal)) / 100;
        let totalPrice = taxItem + (quantity * discountVal);

        totalQty = totalQty + quantity;


        itemListHtmlTag = itemListHtmlTag +
          `<tr>
          <td>` +
          orderItems[i].ordersItems?.agentId + `-` + orderItems[i].products?.upc +
          `</td>
          <td>` +
          price.toFixed(2) +
          `</td>
          <td>` +
          orderItems[i].ordersItems?.quantity +
          `</td>
          <td>` +
          (orderItems[i].ordersItems?.discount === null ? 0 : orderItems[i].ordersItems?.discount) +
          `</td>`;


        if (this.showTaxFlag) {
          taxTdBlock = `<td><b>` +
            (taxItem).toFixed(2) +
            `</b></td>
          <td><b>` +
            orderItems[i].products?.tax +
            `</b></td>`;

        }
        else {
          taxTdBlock = ``;
        }

        itemListHtmlTag += taxTdBlock +
          `<td><b>` +
          (totalPrice).toFixed(2) +
          `</b></td>
        </tr>
        <tr>
          <td colspan="6">` +
          orderItems[i].products?.productName +
          `</td>
           <td><td>
        </tr>
        `;


      } //for loop  

      let tableFooterHtmlTag = `
    </tbody>
      <tfoot>
      <tr>
      <td >Sub Total:</td>
      <td colspan="6" style="text-align: left;border-top: 1px solid #000;">Rs.` + Math.round(Number(order.orderAmount)).toFixed(2) + ` </td>
      
      </tr>
      <tr>
      <td style="text-align: left;">Total Qty:</td>
      <td colspan="5" style="text-align: left;"> ` +
        totalQty +
        `</td>
      </tr>
      <tr>
      <td >Discount:</td>
      <td colspan="5" style="text-align: left;">Rs.` + totalDiscount + ` </td>
      </tr> 
          <tr>
            <td >Tax:</td>
            <td colspan="5" style="text-align: left;">Rs.` + Math.round((Number(order.tax))).toFixed(2) + ` </td>
          </tr><tr> 
        <td ><b>Total: </b></td>
        <td colspan="5" style="text-align: left;"><b>Rs.` + Math.round((Number(order.grandTotal))).toFixed(2) + `</b> </td>
        </tr><tr>
        <td >Cash Paid:</td>
        <td colspan="5" style="text-align: left;">Rs.` + this.result + ` </td>
        </tr><tr>
      <td style="text-align: left;border-bottom: 1px solid #000;" ><b>Customer Balance: </b></td>
      <td colspan="5" style="text-align: left;border-bottom: 1px solid #000;"><b>Rs.` + (this.customerBalance).toFixed(2) + `</b> 
      </td>
      
          </tfoot>
      </table>
    
    `;

      let fbrHtmlTag = `
    <div class="tax fbr" style="display: block;">          

      <img src="assets/images/barcode.jpg" id="imagea" class="usin fbr">
      <p>FBR Invoice#: 133330240702174</p>
      <div class="fbr_logo">
        <img style="width:30mm;" src="assets/images/fbr.png"  alt="We are integrated with FBR">
        <img style="width:30mm;" src="assets/images/FBR_QRReceipt.png" >
      </div>
        <p>
                 <em>Verify your invoice through FBR Tax Asaan Mobile App
                  or SMS at 9966 and win exciting prizes in draw.</em>
        </p>
      
    </div>

    `;

      let contactHtmlTag = `
      <div class="contact">
        <p>If you have any queries related, feel free to reach us at: <br>
            <i class="fa fa-fw fa-phone"></i>+92 300 3932177 +92 21 37293088><br>
            <i class="fa fa-fw fa-envelope"></i>info@bebekingdom.pk<br>
            <i class="fa fa-fw fa-map-pin"></i> Shop#1, Chawla Center, P.E.C.H.S, Block 2, Tariq Road, Karachi
        </p>
      </div>
    `;

      let termHtmlTag = `
    <div class="terms">
      <p>
        <b>**Terms &amp; Conditions**</b>
                                      <br>
                                      Items once sold are exchangeable/replaceable within 3 days. All items must be
                                      returned is in original form (unused, unworn, original packaging, seals, and
                                      tags attached), along with all accessories, manuals, and warranty card that came
                                      with it.
                                      <br>
                                      Items <b>SOLD ON SALE</b> are <b>NOT</b> exchangeable or replaceable.
                                      <br>
                                       GST is exclusive of pricing 
      </p>
    </div>
    `;

      let lastHtmlTag = `
    <p style="margin-left:30px !important;">
        <b>Thanks for your purchase!</b>
    </p>
     
    </div>
     
  
    </body>
  </html>
    `;


      //Add all hmt tags
      let finalHTMLTag = myHtml01Tag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + fbrHtmlTag + contactHtmlTag + termHtmlTag + lastHtmlTag;


      //Initializae payment object after save
      this.payment = new Payment();

      popupWin.document.write(finalHTMLTag);

      popupWin.document.close();

    }//popupWin

  }

  /* ************************************************************************************************** */
  printThermalLastBillOld(order: Orders, customer: Customer, orderItems: OrderItemProductWrapper[]) {

    /* Must open Chrome in KIOSK mode */
    /* "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk-printing */

    this.customer = customer;

    let popupWin;
    //let printContents:HTMLElement = (document.getElementById('print-section-0').innerHTML) as HTMLElement ;
    popupWin = window.open('', '_blank');
    if (popupWin != null || popupWin != undefined) {
      // popupWin.document.open();

      customer.firstName;

      let orderAddress =
        customer?.address +
        ',' +
        customer?.city +
        ',' +
        customer?.stateProvince +
        ',' +
        customer?.postalCode;

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
      <div class="ticket">  ` ;


      if (this.appName === 'ZUBAIDA') {
        myBodyOrder = myBodyOrder + `<img src="assets/images/logos/zubaida-color-logo.png" id="imagea" width: 20mm; text-align: center; ">`;
      }
      else if (this.appName === 'NIKS') {
        myBodyOrder = myBodyOrder + `<img src="assets/images/logos/niks-logo-small.png" id="imagea" width: 20mm; text-align: center; ">`;
      }


      let tHead = '';
      if (this.showTaxFlag) {
        tHead =
          `<thead>
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
        </thead>`
      }
      else {
        tHead =
          `<thead>
          <tr >
              <td colspan="6" style="text-align: left;border-top: 1px solid #000;"><b>Product Description</b></td>
          </tr>
          <tr >
          <td style="text-align: left;border-top: 1px solid #000;"><b>Price</b></td>
          <td style="text-align: left;border-top: 1px solid #000;" ><b>Qty</b></td>
          <td style="text-align: left;border-top: 1px solid #000;" ><b>Discount</b></td>
          <td style="text-align: left;border-top: 1px solid #000;"><b>Total</b></td>
          </tr>
        </thead>`
      }




      myBodyOrder = myBodyOrder +
        `<p style="text-align:left !important;"><b> ABC SONS </b><br>
      STRN:1700223239612|NTN:2232396-1</p>
   
      <h1 style="font-size:13px;text-align:left !important;"><b>Sale Receipt </b></h1>
      <h1 style="font-size:13px;text-align:left !important;"><b> ` +
        customer.firstName + `  (` + customer.phone1 + ` )` +
        `</b></h1>` +
        `<h1 style="font-size:13px;text-align:left !important;"><b> ` +
        order.createDate + `</b></h1>` +

        `<table style="list-style:none;font-size:12px;text-align:left; ">` +
        tHead +
        `<tbody >`;




      let myItems = ``;
      let subtotal = 0;
      let taxItem = 0;
      let totalTax = 0;
      let FbrCharges = 0;
      let total = 0;
      let itemDiscount = 0;

      for (let i = 0; i < orderItems.length; i++) {
        let price = orderItems[i].ordersItems?.unitPrice;//520
        let quantity: any = orderItems[i].ordersItems?.quantity;//1
        let discount = orderItems[i].ordersItems?.discount;//%age 10
        let discountVal = price - (price * discount) / 100;//52


        //taxItem = this.tax(orderItems[i].products); //((price * this.cartDataList.product[i].quantity) * this.cartDataList.product[i].tax )/100;  
        //subtotal = subtotal + price * this.cartDataList.product[i].quantity ;
        // tax = this.cartDataList[i].tax || 0 ;
        taxItem = ((orderItems[i].products?.tax) * (quantity * discountVal)) / 100;
        let totalPrice = taxItem + (quantity * discountVal);

        let discountPrice = 0;

        //totalTax = totalTax + taxItem;
        //price = price * orderItems[i].products?.quantity; //660



        let taxTdBlock = '';




        myItems +=
          `<tr>
              <td colspan="6" style="text-align: left;border-top: 1px solid #000;"><b>` +
          orderItems[i].products?.productName + `( ` + orderItems[i].products?.upc + ` )` +
          `</b></td>
          </tr>
          <tr>
              <td><b>` +
          price.toFixed(2) +

          `</b></td>
              <td><b>` +
          quantity +
          `</b></td>
             <td><b>` +
          discount +
          `</b></td>`;



        if (this.showTaxFlag) {
          taxTdBlock = `<td><b>` +
            taxItem +
            `</b></td>
              <td><b>` +
            orderItems[i].products?.tax +
            `</b></td>`;

        }
        else {
          taxTdBlock = ``;
        }
        myItems += taxTdBlock +

          `<td><b>` +
          totalPrice +
          `</b></td>
          </tr>`;
      }//for


      let mySubTotal = Math.round(Number(order.orderAmount)).toFixed(2);
      let myDiscount = (Number(0)).toFixed(2);
      let myTax = Math.round((Number(order.tax))).toFixed(2);
      let fbrPos = (Number(this.FbrCharges)).toFixed(2);
      let myTotal = Math.round((Number(order.grandTotal))).toFixed(2);

      let finalTaxBlock = ``;
      let myBottonHtml =
        `</tbody>
          <tfoot>
          <tr>
          <td style="text-align: left;border-top: 1px solid #000;">Sub Total:</td>
          <td colspan="5" style="text-align: left;border-top: 1px solid #000;">Rs. ` +
        mySubTotal +
        ` </td>
          
          </tr>
          <tr>
          <td >Discount:</td>
          <td colspan="5" style="text-align: left;">Rs. ` +
        myDiscount +
        ` </td>
          </tr>` ;

      if (this.showTaxFlag) {
        finalTaxBlock = ` 
              <tr>
                <td >Tax:</td>
                <td colspan="5" style="text-align: left;">Rs. ` +
          myTax +
          ` </td>
              </tr>`;
      }

      myBottonHtml = myBottonHtml + finalTaxBlock +

        `<tr> 
            <td ><b>Total: </b></td>
            <td colspan="5" style="text-align: left;"><b>Rs ` +
        myTotal +
        `</b> </td>
            </tr>`;




      myBottonHtml = myBottonHtml +


        `</tfoot>
          </table>
          <p class="centered" style="margin-left:10px !important;">Invoice#:BL` + order.orderId +
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
  
  
  
  
         
         
     </div>
          <p style="margin-left:30px !important;">
          <b>Thanks for your purchase!</b>
          </p>
      
    </body>
    </html>`;

      // <p id="abc" class="centered" style="font-size:small;margin-left:10px !important;">
      // Copyright© 2024 Z GENERATIONS. </p>
      // <p id="abc" style="font-size:7px;">
      // All rights Reserved to Software Developed By <b id="abcc">TechMaci</b>
      // <br> 
      // Ph +92 300-3932177 | Cell +92 21 37293088 
      // </p>


      let myFinalHtml = myHtml + myBodyOrder + myItems + myBottonHtml;
      //alert(myFinalHtml);

      //Initializae payment object after save
      this.payment = new Payment();

      popupWin.document.write(myFinalHtml);

      popupWin.document.close();


    } //end if


  }

  getPrice(product: any): any {
    let price=0;
    if (product.upc==='00448666'){
      price = product.price;
    }
    else{
      price = (product.salePrice
        ? product.salePrice
        : product.unitPrice);
  
    }

    return price;
  }

  salesReportExcel(legacyReport: boolean) {
    this.legacyReport = legacyReport;
    let url = 'reports/' + legacyReport;
    this.router.navigate([url]);

  }

  /* ******************* NEW METHODS ******************************* */

  priceCalculationPerRow(row: any) {

    if (this.cartDataList.product.length === 0) return;

    let priceWithQty = this.cartDataList.product[row].price * this.cartDataList.product[row].quantity;

    if (this.showTaxFlag) {
      if (this.cartDataList.product[row].discount===undefined){
        this.cartDataList.product[row].discount=0;
      }

      if (this.cartDataList.product[row].discountVal===undefined){
        this.cartDataList.product[row].discountVal=0;
      }
      let priceMinusDiscount = (priceWithQty) - Number(this.cartDataList.product[row].discountVal);
      this.cartDataList.product[row].totalTax = ((priceMinusDiscount) * this.cartDataList.product[row].tax) / 100;
      this.cartDataList.product[row].totalPrice = ((Number(priceMinusDiscount) + this.cartDataList.product[row].totalTax).toFixed(2));

    }
    else {
      if (this.cartDataList.product[row].discount===undefined){
        this.cartDataList.product[row].discount=0;
      }

      if (this.cartDataList.product[row].discountVal===undefined){
        this.cartDataList.product[row].discountVal=0;
      }
      this.cartDataList.product[row].totalPrice = ((Number((priceWithQty) - Number(this.cartDataList.product[row].discountVal))).toFixed(2));
    }




  }

  priceCalculationTotal(): void {



    this.priceSummary.tax = 0;
    this.priceSummary.total = 0;
    this.priceSummary.discount = 0;
    this.priceSummary.grandTotal = 0;
    this.priceSummary.totalQty = 0;
    this.priceSummary.totalWithoutDiscount = 0;

    if (this.cartDataList.product.length === 0) return;

    let finalPrice = 0;
    //let row = -1;

    if (this.showTaxFlag) {

      for (let row = 0; row < this.cartDataList.product.length; row++) {
        let totalTax = 0, totalDiscount = 0, total = 0, grandTotal = 0, totalQty = 0, totalPrice = 0;


        totalTax = Number(this.cartDataList.product[row].totalTax);
        this.priceSummary.tax += Number(totalTax);

        if (this.cartDataList.product[row].discountVal===undefined){
          this.cartDataList.product[row].discountVal=0;
        }

        totalDiscount = Number(this.cartDataList.product[row].discountVal);
        this.priceSummary.discount += Number(totalDiscount);

        totalQty = Number(this.cartDataList.product[row].quantity);
        this.priceSummary.totalQty += Number(totalQty);

        total = Number(this.cartDataList.product[row].price * totalQty) - totalDiscount;
        this.priceSummary.total += Number(total);

        totalPrice = Number(this.cartDataList.product[row].price);
        this.priceSummary.totalWithoutDiscount += totalPrice;


        this.priceSummary.grandTotal += Number(this.cartDataList.product[row].totalPrice);


      }//for loop


    }
    else {
      for (let row = 0; row < this.cartDataList.product.length; row++) {
        let totalTax = 0, totalDiscount = 0, total = 0, grandTotal = 0, totalQty = 0, totalPrice = 0;

        if (this.cartDataList.product[row].discountVal===undefined){
          this.cartDataList.product[row].discountVal=0;
        }

        totalDiscount = Number(this.cartDataList.product[row].discountVal);
        this.priceSummary.discount += Number(totalDiscount);
        let qty = Number(this.cartDataList.product[row].quantity);
        totalQty = qty;
        this.priceSummary.totalQty += Number(totalQty);
        total = Number(this.cartDataList.product[row].totalPrice);
        this.priceSummary.total += Number(total);

        totalPrice = Number(this.cartDataList.product[row].price);
        this.priceSummary.totalWithoutDiscount += totalPrice;


        this.priceSummary.grandTotal += Number(this.cartDataList.product[row].totalPrice);


      }//for loop


    }

    this.priceSummary.grandTotal = Number(Math.round((Number(this.priceSummary.grandTotal))).toFixed(2));


  }



  /* ************************** THE END ***************************************** */



}
