import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  AdminUser,
  ApiResponse,
  BarcodeResponse,
  CartHold,
  CashierShift,
  Category,
  CodeMaster,
  Customer,
  CustomerRequest,
  DbUpdate,
  Departments,
  OrderItemProductWrapper,
  OrderResponse,
  OrderSaveResponse,
  OrderSearch,
  Orders,
  OrdersCustomerPaymentWrapper,
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
import { faPrint, faList, faCloudUpload, faCloudDownload, faPerson, faCreditCard, faCashRegister, faPlusSquare, faDashboard, faRemove, faRupeeSign, faDollar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';

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
import { LicenseService } from '../services/license.service';
import { PrintService } from '../services/print.service';
import { firstValueFrom } from 'rxjs';
import { LoginService } from '../services/login.service';
import { faPauseCircle } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss'],
})
export class PosComponent {
  private myUrl = environment.apiUrl;
  private cloudAPIUrl = environment.cloudAPIUrl;

  printTokenFlag = environment.printTokenFlag;
  useItemDiscountValue = environment.useItemDiscountValue;

  posTime: string = '00:00:00';
  seconds = 0;
  disablePOSFlag = false;
  defaultCustomer: Customer = new Customer();
  customerSearchList: Customer[] = [];
  searchTimeout: any;
  showCustomerPanel: boolean = false;
  cashierShift: CashierShift = new CashierShift();
  closeBalanceFlag = false;
  showOpenBalanceFlag = environment.showOpenBalanceFlag;
  useDiscountValue = environment.useDiscountValue;
  orderType = false;
  orderNotes = '';

  billCopyNumber = environment.billCopyNumber;

  faCreditCard = faCreditCard;
  faCashRegister = faCashRegister;
  faPrint = faPrint;
  faList = faList;
  faPauseCircle = faPauseCircle;
  faSearch = faSearch;
  branchName = environment.branchName;
  currencyName = environment.currency;
  currency = environment.currency;
  showReturnsFlag = environment.showReturnsFlag;

  printThermalHTMLTag = '';
  totalSaleCount: number = 0;
  legacyReport: boolean = false;
  taxCouponFlag: boolean = false;
  whatsappFlag: boolean = false;

  attemptCount = 0;
  attempTotalCount = 0;
  invoiceNumber: any = 'BL00012';
  //selectedAgent: AdminUser | undefined;
  mobileshow: any = false;
  nameSearchModal: any = false;
  logoName = environment.logoName;
  categoryId: number = 0;
  public isLoggedIn = false;
  faSignOut = faSignOut;
  faPerson = faPerson;


  // @ViewChild('result')
  // result!:ElementRef;
  result: any = '';


  totalDiscount: any = '';
  totalDiscountPercentage = 0;
  totalTaxValue: any = '';
  totalTax = 0;
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
  posHomeCart: CartHold = new CartHold();
  // posHomeCart1: CartHold[] = [];
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
  partialModal: boolean = false;
  customerBalance: number = 0;
  items: any[] = []; // Assuming this array contains your items

  // priceSummary: PriceSummary = {
  //   price: 0,
  //   discount: 0,
  //   tax: 0,
  //   delivery: 0,
  //   total: 0,
  //   grandTotal: 0,
  //   totalQty: 0,
  //   totalWithoutDiscount: 0,
  //   totalItems: 0,
  //   taxesPercentage: 0,
  //   discountPercentage: 0,
  // };

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
  showAgent = environment.showAgentFlag;
  cancelSaleFlag: boolean = true;
  retrieveSaleFlag: boolean = true;
  showTaxFlag: boolean = true;
  salesAgentList: AdminUser[] = [];
  payment: Payment = new Payment();
  fbrInvoiceNumber: any;
  fbrQRCode: BarcodeResponse = new BarcodeResponse();
  orderCustomerWrapper: OrdersCustomerPaymentWrapper = new OrdersCustomerPaymentWrapper();
  paymentList: any[] = [];
  paymentMultiList: OrdersCustomerPaymentWrapper[] = [];
  addPartialPaymentFlag: boolean = false;
  paymentMethodList: CodeMaster[] = [];
  selectedPaymentMethod: any;
  instalmentAmount: any;
  orderSearch = '';
  phoneSearch = '';
  showPartialPaymentFlag: boolean = false;
  multiPaymentListFlag: boolean = false;
  faDollar = faDollar;
  currencySign = '$';
  selectedAgent: any;

  trialDaysLeft = 0;

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
    private reportsService: ReportsService,
    private licenseService: LicenseService,
    private printService: PrintService,
    private loginService: LoginService,

  ) { }

  ngOnInit(): void {
    let holdData = localStorage.getItem('posHomeCart');
    this.signInUser = sessionStorage.getItem("username");
    this.cancelSaleFlag = environment.cancelSaleFlag;
    this.retrieveSaleFlag = environment.retrieveSaleFlag;
    this.showTaxFlag = environment.showTaxFlag;
    this.attemptCount = 0;
    this.attempTotalCount = 0;
    this.printThermalHTMLTag = ''//init the tag
    this.instalmentAmount = 0;
    this.selectedPaymentMethod = '';
    this.addPartialPaymentFlag = false;
    this.paymentList.length = 0;
    this.orderSearch = '';
    this.phoneSearch = '';
    this.showPartialPaymentFlag = true;

    setInterval(() => {
      this.seconds++;
      this.posTime = this.formatTime(this.seconds);
    }, 1000);


    if (!environment.posCustomerNameFlag) {
      this.customer.firstName = 'POSCustomer';//set default
    }
    if (!environment.posCustomerEmailFlag) {
      this.customer.email = 'info@techmaci.com';//set default
    }

    if (environment.currency === 'USD') {
      this.faDollar = faDollar;
      this.currencySign = '$';
    }
    else if (environment.currency === 'CAD') {
      this.faDollar = faDollar;
      this.currencySign = '$';
    }
    else if (environment.currency === 'PKR') {
      this.faDollar = faRupeeSign;
      this.currencySign = 'Rs';
    }


    /* ************ Default Customer *************** */
    let customerObj = localStorage.getItem('customer');
    if (customerObj) {
      this.defaultCustomer = JSON.parse(customerObj);
      if (this.defaultCustomer.custName !== 'pos') {
        this.customer = this.defaultCustomer;
      }
    }
    else {
      this.customerService.getByCustName('pos').subscribe((data: Customer) => {
        this.defaultCustomer = data;

        localStorage.setItem('customer', JSON.stringify(this.defaultCustomer));
      });
    }

    /* ****************** Cash Register *********************** */
    let cashRegisterObj: any = sessionStorage.getItem('cashierShift');

    if (this.showOpenBalanceFlag) {
      if (cashRegisterObj === '' || cashRegisterObj === undefined || cashRegisterObj === null) {
        Swal.fire('Warning', 'Sale for Today has been closed. Please logout or print XReport', 'warning');
        this.disablePOSFlag = true;
        this.showOpenBalanceFlag = false;
        return;
      }

    }
    this.cashierShift = JSON.parse(cashRegisterObj);



    // this.licenseService.checkLicense().subscribe(res => {
    //   const end = new Date(res.trialEndDate).getTime();
    //   const now = Date.now();
    //   this.trialDaysLeft = Math.ceil(
    //     (end - now) / (1000 * 60 * 60 * 24)
    //   );
    // });



    this.initPaymentMethodList()

    // //COMMENTED On Dec 25, 2024, as per Muneef
    // this.salesAgentList = this.cache.getList("salesAgent");
    // this.selectedAgent = new AdminUser();
    // this.selectedAgent = JSON.parse(this.cache.get("selectedAgent"));
    ////////////////////////////////////////////////////////////////////////

    //Get totalSaleCount
    this.totalSaleCount = 0;

    this.reportsService.getDailySaleTotalCount().subscribe((data: number) => {
      if (data !== undefined) {

        this.totalSaleCount = data;
      }
    });


    if (this.salesAgentList === undefined || this.salesAgentList === null || this.salesAgentList.length === 0) {
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
            }//for loop
            if (this.salesAgentList.length > 0 && this.selectedAgent === undefined) {
              this.selectedAgent = this.salesAgentList[0].userId;
            }
            else if (this.salesAgentList.length > 0 && this.selectedAgent === null) {
              this.selectedAgent = this.salesAgentList[0].userId;
            }

          }
        }


        if (this.salesAgentList.length > 0 && this.selectedAgent === undefined) {
          this.selectedAgent = this.salesAgentList[0].userId;
        }
        else if (this.salesAgentList.length > 0 && this.selectedAgent === null) {
          this.selectedAgent = this.salesAgentList[0].userId;
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
      this.posHomeCart = JSON.parse(holdData);
      this.customer.firstName = this.posHomeCart.customer.firstName;
      this.customer.email = this.posHomeCart.customer.email;
      this.customer.phone1 = this.posHomeCart.customer.phone1;

      this.priceCalculationTotal();

    } //end if



    //window.scrollTo(0, 0);
    this.errorMsg = '';
    this.searchFlag = false;
    let search = '';

    // //Only select Agent when it was not selected before
    // setTimeout(() => {
    //   if (this.selectedAgent === undefined || this.selectedAgent === null) {
    //     this.agentFocus(true);
    //   }
    //   else {
    //     this.focusUpc(true);
    //   }

    // }, 500);



    // //@TODO TESTING
    // let payment:Payment = new Payment();
    // payment.orderId=1;
    // payment.instalmentAmount=2000;
    // payment.instalmentDate="2024-09-21";
    // payment.totalAmount=20000;
    // payment.remainingBalance=18000;
    // payment.paymentMethod='CASH';

    // this.paymentList.push(payment);



  } //ngOnInit




  agentFocus(focusFlag: boolean) {
    let agentInput = <HTMLInputElement>document.getElementById('selectAgentInput');
    if (agentInput !== null) {
      if (focusFlag) {
        if (this.selectedAgent === undefined || this.selectedAgent === null) {
          agentInput.focus();
        }
      }

      agentInput.autofocus = focusFlag;
    }

  }


  ngAfterViewInit(): void {
    let len = this.posHomeCart.product.length - 1;

    if (this.cashModal) {
      //setTimeout(()=> this.result.nativeElement.focus(),0);
      let resultInput = <HTMLInputElement>document.getElementById('result');
      resultInput.focus();
    }
    else {
      const discountColName = 'discount_' + len;
      this.discountFocus(false, discountColName);
      this.agentFocus(true);

    }

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
    for (let i = 0; this.posHomeCart.product.length; i++) {

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

      let posHomeCartData = localStorage.getItem('posHomeCart');
      if (posHomeCartData) {
        //Now get the existing cart with products/customer and other data
        rcvdProduct = JSON.parse(posHomeCartData);
      }
      else {
        //create brand new cart 
        rcvdProduct.customer = new Customer();
        rcvdProduct.shipping = this.posHomeCart.shipping;
        rcvdProduct.subTotal = this.posHomeCart.subTotal;
        rcvdProduct.taxes = this.posHomeCart.taxes;
        rcvdProduct.transactionId = 0;
        rcvdProduct.total = this.posHomeCart.total;

      }
      productView.quantity = this.productQuantity;
      productView.agentId = this.selectedAgent;//?.userId; //both are integer, userId is the PK of admin_user table
      productView.loginId = this.selectedAgent;//?.loginId;
      //productView.firstName = this.selectedAgent;//?.firstName;

      rcvdProduct.product.push(productView);

      this.productService.localAddToCart(rcvdProduct);
      //this.posHomeCart1.push(rcvdProduct);


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
          this.productcheckList = data;
          if (this.productcheckList === null) {
            Swal.fire('Not Found', 'Product Does not exist', 'error');
          }

        });

      }



    }
  }

  searchText = '';

  selectProduct(product: any) {
    //this.selectedProduct = product;
    this.searchText = product.name;   // show selected name in input
    this.productList = [];            // hide dropdown

    this.addItemsToCart(product);

    // console.log('Selected product:', product);
  }

  onNameSearch(event: any) {
    const value = event.target.value.trim();

    if (value.length < 4) {
      this.productList = [];
      return;
    }

    this.productService.getSearchProducts(value)
      .subscribe((res: any[]) => {
        this.productList = res;
      });
  }


  nameSearchKey() {

    let productView: ProductView[] = [];
    //this.onSearch();
    let nameSearch = <HTMLInputElement>document.getElementById('name-search');
    this.search = nameSearch.value;

    if (this.search === null || this.search === undefined || this.search === '') {
      //Don't do anything
    }
    else {
      this.productService.getSearchProducts(this.search).subscribe((data) => {
        //let productId = data.productId;
        this.productList
        productView = data;



        if (productView === null) {
          Swal.fire(
            'Not Found',
            'Product Does not exist for this UPC',
            'error'
          );

        }
        else if (productView !== null || productView !== undefined) {


          alert('Product List: ' + productView.length);

          // if (productView.quantity === 0 || productView.quantity < 0) {
          //   Swal.fire('OUT OF STOCK', 'Product is Out of Stock', 'warning');
          //   return;
          // }
          // else if (productView.quantity < 2) {
          //   Swal.fire('LAST ITEM', 'Product will be Out of Stock soon', 'warning');
          //   this.addItemsToCart(productView);
          // }
          // else {
          //   this.addItemsToCart(productView);
          // }
        }

      });

    }

  }

  /* ****************************************************************** */
    addItemsToCart(productView: ProductView) {
  
      //There are 3 possibilities when product/upc found:
      //1-There was no Cart available, brand new case
      //2-Cart available but no products
      //3-Cart available some products, and this upc is new to cart
      //4-Cart available and this upc scanned again, increase QTY
      let found = false;
      let foundRow = 0;
      //this.resetProductViewPrices(productView);
      //Check Cart in cache
      let posHomeCartData = localStorage.getItem('posHomeCart');
      let cartData: CartHold = new CartHold();
  
      if (this.selectedAgent === undefined) {
        Swal.fire('REQUIRED', 'Please select Agent', 'warning');
        return;
      }
  
      
  
  
      if (posHomeCartData) {
        //CASE-2,3,4
        //Now get the existing cart with products/customer and other data
        cartData = JSON.parse(posHomeCartData);
        //check if there is any product in this cart
        if (cartData.product.length > 0) {
          //CASE 3 or 4, Check this product in Cart
  
          for (let i = 0; i < cartData.product.length; i++) {
            if (cartData.product[i].productId === productView.productId) {
              found = true;
              foundRow = i;//saved row found in
              break;
  
            }
          }//for loop
          if (!found) {
            //CASE-3-Cart available some products, and this upc is new to cart
            productView.quantity = 1;
            productView.agentId = this.selectedAgent;//?.userId;
            productView.loginId = this.selectedAgent;//;?.loginId;
            //productView.firstName = this.selectedAgent?.firstName;
            productView.price = this.getPrice(productView);
            productView.totalPrice = 0;
            productView.totalTax = 0;
  
            //@TODO Commented out 2024-09-06
            //productView.discount = 0;
            productView.discountVal = this.totalDiscount;
            cartData.product.push(productView);
            localStorage.setItem('posHomeCart', JSON.stringify(cartData));
            //this.productService.pickupAddToCart(cartData);
  
          }
          else {
            //CASE-4-Cart available and this upc scanned again, increase QTY
            //Get current Qty from Cart.product found and add one to it
            cartData.product[foundRow].quantity = Number(Number(cartData.product[foundRow].quantity) + 1);
            let price = this.getPrice(productView);
            //cartData.product[foundRow].price = Number(price) * Number(cartData.product[foundRow].quantity);
            this.posHomeCart = cartData;
            this.calculateDiscount(this.posHomeCart.product[foundRow].discount, foundRow);
            this.priceCalculationPerRow(foundRow);
            this.priceCalculationTotal();
            //this.productService.pickupAddToCart(cartData);
            localStorage.setItem('posHomeCart', JSON.stringify(cartData));
  
  
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
          productView.agentId = this.selectedAgent;//?.userId;
          productView.loginId = this.selectedAgent;//?.loginId;
          //productView.firstName = this.selectedAgent?.firstName;
          productView.price = this.getPrice(productView);
          productView.totalPrice = 0;
          productView.totalTax = 0;
  
          //@TODO Commented out 2024-09-06
          // productView.discount = 0;
          // productView.discountVal = 0;
          productView.discountVal = this.totalDiscount;
  
          cartData.product.push(productView);
  
          localStorage.setItem('posHomeCart', JSON.stringify(cartData));
  
        }
  
      }
      else {
        //CASE-1: No Cart available, No Item available, Brand new Empty Case
        //create brand new cart of type cartHold, already declared
        //@@COMMENTED on Mar19
        // cartData.customer = new Customer();
        // if (!environment.posCustomerNameFlag) {
        //   cartData.customer.firstName = 'POSCustomer';//set default
        // }
        // if (!environment.posCustomerEmailFlag) {
        //   cartData.customer.email = 'info@techmaci.com';//set default
        // }
        // cartData.customer.phone1 = this.customer.phone1;
  
        cartData.shipping = 0;
        cartData.subTotal = 0;
        cartData.discount = 0;
        cartData.taxes = 0;
        cartData.transactionId = 0;
  
        //Add new item to product List for this cart
        productView.quantity = 1;
        productView.agentId = this.selectedAgent;//?.userId;
        productView.loginId = this.selectedAgent;//?.loginId;
        //productView.firstName = this.selectedAgent?.firstName;
        productView.price = this.getPrice(productView);
        productView.totalPrice = 0;
        productView.totalTax = 0;
  
        //@TODO Commented out 2024-09-06
        // productView.discount = 0;
        // productView.discountVal = 0;
        productView.discountVal = this.totalDiscount;
  
        cartData.product.push(productView);
  
        localStorage.setItem('posHomeCart', JSON.stringify(cartData));
  
      }
  
      this.posHomeCart = cartData; //Assign current local cartData
      //Finally, set all variables and focus on Discount
      let count = this.posHomeCart.product.length - 1;
  
      this.posHomeCart.discount = this.customer.discountAmount;
      this.posHomeCart.discountPercentage = this.customer.discountPercentage;
  
      this.priceCalculationPerRow(count);
      this.priceCalculationTotal();
      //Save again
      localStorage.setItem('posHomeCart', JSON.stringify(this.posHomeCart));
  
      let discountColName = '';
      if (found) {
        discountColName = `discount_${foundRow}`;
        //this.discountFocus(true, discountColName);
      }
      else {
        discountColName = `discount_${count}`;
        //this.discountFocus(true, discountColName);
      }
  
      // ✅ clear search + dropdown
      this.searchText = '';
      //this.showNameSearchDropdown = false;
  
  
      //Play Beep
      new Audio('assets/audio/beep.mp3').play();
  
  
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
        if (this.selectedAgent === undefined || this.selectedAgent === '') {
          Swal.fire('Agent Required', 'Please select an Agent', 'warning');
          return;
        }

        // let found = false;
        // let foundRow = 0;
        let productView: ProductView = new ProductView();
        //serach product by UPC
        this.productService.getProductsByUPC(upc).subscribe((data) => {
          qtyInput.value = '';
          if (data === undefined) {
            Swal.fire(
              'Not Found',
              'Product Does not exist for this UPC',
              'error'
            );
            qtyInput.value = '';
          }
          productView = data;



          if (productView === null) {
            Swal.fire(
              'Not Found',
              'Product Does not exist for this UPC',
              'error'
            );
            qtyInput.value = '';
          }
          else if (productView !== null || productView !== undefined) {
            if (productView.quantity === 0 || productView.quantity < 0) {
              Swal.fire('OUT OF STOCK', 'Product is Out of Stock', 'warning');
              return;
            }
            else if (productView.quantity < 2) {
              Swal.fire('LAST ITEM', 'Product will be Out of Stock soon', 'warning');
              this.addItemsToCart(productView);
            }
            else {
              this.addItemsToCart(productView);
            }
          }
        });
      }
    } else {
      myScan = event.target.value;
    }
  }

  checkStock(productView: ProductView) {
    let retFlag = true;
    if (productView.quantity === 0 || productView.quantity < 0) {
      Swal.fire('OUT OF STOCK', 'Product is Out of Stock', 'warning');
      return false;
    }
    else if (productView.quantity < 2) {
      Swal.fire('LAST ITEM', 'Product will be Out of Stock soon', 'warning');
      return true;
      //this.addItemsToCart(productView); 
    }
    else {
      return true;
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
          if (this.selectedAgent === undefined || this.selectedAgent === '') {
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
              this.addItemsToCart(productView);
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
        if (this.selectedAgent === undefined || this.selectedAgent === '') {
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
            this.addItemsToCart(productView);
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

    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      let qtyInput = <HTMLInputElement>document.getElementById('priceCheck');
      if (qtyInput === undefined) {
        return;
      }
      let upc = qtyInput.value;
      if (upc !== undefined || upc !== '') {
        //serach product by UPC
        this.productService.getProductsByUPC(upc).subscribe((data) => {
          if (data === null) {
            Swal.fire(
              'Not Found',
              'Product Does not exist for this UPC',
              'error'
            );

          }
          else {
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

              rcvdProduct.productName = data.productName;
              rcvdProduct.discount = data.discount;
              rcvdProduct.discountVal = data.discountVal;
              rcvdProduct.unitPrice = data.unitPrice;
              rcvdProduct.salePrice = data.salePrice;
              rcvdProduct.agentId = this.selectedAgent;//?.userId;
              rcvdProduct.loginId = this.selectedAgent;//?.loginId;
              //rcvdProduct.firstName = this.selectedAgent?.firstName;

              this.productcheckList.push(rcvdProduct);

            }
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
    let posHomeCart = localStorage.getItem('posHomeCart');
    //localcart data check
    if (posHomeCart) {

      let cartDataArray = JSON.parse(posHomeCart);
      if (Object.keys(cartDataArray.product).length > 0) {
        // Swal.fire("Please complete the transections");
        Swal.fire('WARNING', 'Please complete Your transaction', 'warning')
        return;
      } else {

        let cartData = cartDataArray[0];
      }
    }
    //else {
    //   Swal.fire('WARNING', 'No Hold Sale Found', 'warning')
    //   return;
    // }

    //retrive list show
    let holdSalesObj = this.cache.getList('holdCartList');
    this.holdSales = holdSalesObj;
    if (holdSalesObj === null) {
      Swal.fire('WARNING', 'No Item scanned for Hold', 'warning')
      return;
    }
    else {
      let holdSaleArray: CartHold[] = [];
      //Not an array, just carthold object
      if (this.holdSales.length === undefined) {
        holdSaleArray.push(holdSalesObj);
        this.holdSales = holdSaleArray;

      }

      this.retrieveSalePopup = true;

    }



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




  /* ************************************************************** */
  openCashModal() {
    let posHomeCart = localStorage.getItem('posHomeCart')
    if (posHomeCart === undefined || posHomeCart === '' || posHomeCart === null || posHomeCart.length === 105 || posHomeCart.length === 0) {
      Swal.fire('WARNING', 'Cart is Empty', 'warning');
      return;
    }
    // if (this.customer.phone1 === undefined) {
    //   Swal.fire('WARNING', 'Please input Customer Phone Number', 'warning');
    //   return;
    // }
    // if (this.customer.phone1 === '') {
    //   Swal.fire('WARNING', 'Please input Customer Phone Number', 'warning');
    //   return;
    // }

    if (posHomeCart != null || posHomeCart != undefined) {
      this.posHomeCart = JSON.parse(posHomeCart);
      if (this.posHomeCart.product.length === 0) {
        Swal.fire('WARNING', 'Cart is Empty', 'warning');
        return;
      }
      else {
        this.payment.paymentMethod = 'CASH';

        this.focusUpc(false);
        this.agentFocus(false);
        //this.discountAllNotFocus();

        this.cashModal = true;
        let resultInput = <HTMLInputElement>document.getElementById('result');
        resultInput.focus();
        //this.cashModal.nativeElement.focus();
        if (this.
          posHomeCart.total < 0) {

          resultInput.value = '' + this.posHomeCart.total; //.toFixed(2);
        }
        else {
          resultInput.value = ''; //(0).toFixed(2);
        }
        resultInput.autofocus = true;
        //resultInput.value='0';

        setTimeout(() => {
          let resultInput = <HTMLInputElement>document.getElementById('result');
          resultInput.focus();

        }, 500);

      }
    }


  }
  /* ************************************************************** */
  closeCashModal() {
    this.cashModal = false;
    this.result = '';
    this.customerBalance = 0;
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

    let posHomeCart = localStorage.getItem('posHomeCart');
    //posHomeCart = always one object of cartHold type
    //holdCarts =  could be array list of posHomeCarts of type cartHold[]
    if (!this.customer.phone1) {
      // Show alert for required fields
      Swal.fire('WARNING', 'Please enter the Customer Phone number to Hold the Sale', 'warning');
      return; // Don't proceed with saving
    }


    if (posHomeCart) {
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


    this.posHomeCart.customer.firstName = this.customer.firstName;
    this.posHomeCart.customer.email = this.customer.email;
    this.posHomeCart.customer.phone1 = this.customer.phone1;


    // if (!this.customer.firstName) {
    //   // Show alert for required fields
    //   Swal.fire('WARNING', 'Please fill The Customer Name', 'warning');
    //   return; // Don't proceed with saving
    // }
    let holdCartList: CartHold[] = [];
    let posHomeCart = localStorage.getItem('posHomeCart');
    //posHomeCart = always one object of cartHold type
    //holdCarts =  could be array list of posHomeCarts of type cartHold[]
    if (posHomeCart) {
      let holdCartListObj: any;
      //this cart list in hold already
      holdCartListObj = localStorage.getItem('holdCartList');

      if (holdCartListObj === null) {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(posHomeCart);
        currentHoldData.transactionId = 1;

        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);
      }
      else if (holdCartListObj === undefined) {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(posHomeCart);
        currentHoldData.transactionId = 1;

        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);

      }
      else if (holdCartListObj === '') {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(posHomeCart);
        currentHoldData.transactionId = 1;
        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);
      }
      else if (holdCartListObj.length === 0) {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(posHomeCart);
        currentHoldData.transactionId = 1;
        currentHoldData.customer = this.customer;
        //Brand New first time holding a customer cart
        this.cache.setList('holdCartList', currentHoldData);
      }

      else if (holdCartListObj === '[]') {
        //there is nothing in holdCartList in cache
        let currentHoldData: CartHold = JSON.parse(posHomeCart);
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

        let posHomeCartObj: CartHold = JSON.parse(posHomeCart);
        if (holdCartList.length === undefined) {

          posHomeCartObj.transactionId = holdCartList.transactionId + 1;

          posHomeCartObj.customer = this.customer;
          newHoldCartList.push(holdCartList);
          newHoldCartList.push(posHomeCartObj);
          //Overwrite current one CartHold Object in cache with 2 carthold for 2 customers
          this.cache.setList('holdCartList', newHoldCartList);

        }
        else if (holdCartList.length > 0) {
          //This is the case when CartHold is having multiple customers cart
          let newHoldCartList: CartHold[] = [];
          let posHomeCartObj: CartHold = JSON.parse(posHomeCart);
          posHomeCartObj.transactionId = holdCartList[holdCartList.length - 1].transactionId + 1;
          posHomeCartObj.customer = this.customer;




          newHoldCartList.push(...holdCartList);
          newHoldCartList.push(posHomeCartObj);
          //Overwrite current one CartHold Object in cache with 2 carthold for 2 customers
          this.cache.setList('holdCartList', newHoldCartList);

        }

      }//else
      localStorage.removeItem('posHomeCart');
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
      // if (len > 2) {
      //   qtyInput.value = qtyInput.value.toString().slice(0, 2);
      // }
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
        if (qty === 0) {
          Swal.fire('NO NEGATIVE QTY', 'Qty should be positive', 'warning');
          return;
        }
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
      if (qty < 1) {
        //0 or below not allowed
        Swal.fire('WARNING', '0 or negative Qty is not allowed', 'warning');
        return;

      }
      // if (len > 2) {
      //   qtyInput.value = qtyInput.value.toString().slice(0, 2);
      // }

      let posHomeCartData = localStorage.getItem('posHomeCart');
      if (posHomeCartData) {
        let qtydata: CartHold = JSON.parse(posHomeCartData);
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

        localStorage.setItem('posHomeCart', JSON.stringify(qtydata));

        this.posHomeCart = qtydata;

        this.calculateDiscount(this.posHomeCart.product[row].discount, row);

        this.priceCalculationPerRow(row);
        this.priceCalculationTotal();

        localStorage.setItem('posHomeCart', JSON.stringify(this.posHomeCart));

      }
      else {
        //Nothing to do if there is no data in Cart
      }

    }

  }
  /* *************************************************************** */
  calculateQtyTotal(posHomeCart: CartHold) {
    this.posHomeCart.totalQty = 0;
    if (posHomeCart !== undefined) {
      if (posHomeCart.product.length > 0) {
        for (let i = 0; i < posHomeCart.product.length; i++) {
          this.posHomeCart.totalQty = this.posHomeCart.totalQty + Number(posHomeCart.product[i].quantity);
        }
        this.posHomeCart.totalItems = posHomeCart.product.length;
      }
    }
  }


  /* ******************************************************* */



  /* ********************************************* */
  removeItem(orderItem: any, index: any) {
    let itemToRemove = this.posHomeCart.product[index];
    //let details = this.posHomeCart.product[index]?.productDetails;
    //this.posHomeCart.product.splice(index, 1);

    this.posHomeCart.product = this.posHomeCart.product.filter(item => item !== itemToRemove);
    this.priceCalculationTotal();
    localStorage.setItem('posHomeCart', JSON.stringify(this.posHomeCart));



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
    let posHomeCart = localStorage.getItem('posHomeCart');
    if (posHomeCart == '' || posHomeCart == undefined) {
      Swal.fire('Your Cart is Emty');
      return;
    }
    if (posHomeCart != null || posHomeCart != undefined) {
      this.posHomeCart = JSON.parse(posHomeCart);
    }

    let currentUser: any = sessionStorage.getItem('currentUser');
    let customer: Customer = JSON.parse(currentUser);

    // let currentUser: any = sessionStorage.getItem('currentUser');
    //let customer: any = JSON.parse(posHomeCart);
    this.commonCheckOut(posHomeCart, customer);
  } //guestCheckout()
  /* ******************************************************* */
    /* ******************************************************* */
    commonCheckOut(pickupCart: any, customer: Customer) {
  
      if (pickupCart) {
  
        let orderSaveResponse: OrderSaveResponse = new OrderSaveResponse();
  
        let myRefferral = this.cache.get('representative');
  
        /* ******************** CHECKOUT Disable ************************** */
        //this.router.navigate(['/checkout']);
  
        /* ******************** ORDER Header Data ************************** */
        let order: Orders = new Orders();
        order.custId = customer.custId;
  
        //Check if it is Delivery
        if (this.orderType) {
          order.orderType = 'DELIVERY';
        }
        else {
          order.orderType = 'PICKUP';
        }
  
  
        order.pickupType = 'ONSITE'; //this.cartForm.get('pickupType')?.value;
        order.pickupTime = 'DAYTIME'; //this.cartForm.get('pickupTime')?.value;
        order.orderStatus = 'NEW';
        order.updatedBy = this.signInUser;
        order.price = 0; //this.priceSummary.price
  
        //This will get item orders amount and item discount
        this.getOrderAmount(order);
        //order.orderAmount = this.getOrderAmount(order); //this.priceSummary.total;//order.price; //price/cut price of each item
  
        //order.discount = this.priceSummary.discount;
        //Change made on April 04, 2026
        //Write discount value not %
        //let orderDiscount = this.posHomeCart.discount ;
        //let discountValue = (order.orderAmount * orderDiscount)/100;
        //Add Item discount and Total Sale Discount in order.discount
        order.discount = this.posHomeCart.discount;
  
        order.posName = environment.posName;
        order.branchName = environment.branchName;
        order.custPhone = customer.phone1;
        order.custEmail = customer.email;
        order.grandTotal = this.posHomeCart.total;;
        order.notes = this.orderNotes;
  
        if (this.showTaxFlag) {
          //        order.grandTotal = this.priceSummary.total + this.priceSummary.tax - this.priceSummary.discount;
          order.tax = this.posHomeCart.taxes.toFixed(2);
          orderSaveResponse.showTaxFlag = this.showTaxFlag;
        }
        else {
          //      order.grandTotal = this.priceSummary.total;
          order.tax = 0;
          this.taxCouponFlag = true;//Don't print FBR QR
        }
  
        orderSaveResponse.taxCouponFlag = true; //this.taxCouponFlag; No need of FBR for demo
  
  
        //order.shippingHandling = this.posHomeCart.delivery.toFixed(2);
  
  
        orderSaveResponse.orders = order;
  
        let orderItem: OrdersItems;
        let productData: Product;
  
        /* ******************* ITEMS LOOP ********************* */
        this.posHomeCart.product.forEach((items) => {
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
          orderItem.itemStatus = 'CLOSED';
          orderItem.agentId = items.agentId; //Both are integer
          orderItem.discountValue = items.discountVal;
          orderItem.taxAmount = items.totalTax;
          orderItem.totalPrice = items.totalPrice;
          orderItem.notes = items.notes;
          orderItem.orderId = order.orderId
  
          orderSaveResponse.orderItems?.push(orderItem);
  
        });//this.posHomeCart?.forEach((items)=>
  
        let len = orderSaveResponse.orderItems.length;
        orderSaveResponse.orders = order;
        //this.payment.orderId = orderId;
        this.payment.discount = this.posHomeCart.discount;
        this.payment.taxesAmount = this.posHomeCart.taxes;
        this.payment.totalAmount = this.posHomeCart.total;
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
                localStorage.setItem('posHomeCart', '');
                //this.selectedAgent = new AdminUser();
                //this.cache.set("selectedAgent", JSON.stringify(this.selectedAgent));
  
                this.cache.set('reload', 'F');
  
                //Swal.fire('Submit', 'Order#' + orderNum + ' has been created.', 'success')
  
                Swal.fire({ title: 'Order', timer: 1000, text: `'Order# ${orderNum}!`, icon: 'success' })
                  .then((result) => {
                    {
                      this.cache.set('reload', 'F');
  
                      //printThermal(customer: Customer, payment: Payment, posHomeCart: CartHold, customerBalance: number, invoiceNumber: any)
                      let dinInFlag = false;
                      this.printService.printThermalRestaurant(customer, this.payment, this.posHomeCart,
                        this.customerBalance, this.invoiceNumber, this.printTokenFlag, this.todaydatashow, this.orderNotes, dinInFlag, this.billCopyNumber);
  
                      //Reset to Default Customer
                      this.customer = new Customer();
                      localStorage.setItem('customer', JSON.stringify(this.defaultCustomer));
  
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
  
  
      }//end if pickupCart
    }//commonCheckOut()
  
  
    /* *********** CHECKOUT ENDS *************** */
  

  /* ******************************************************* */
  weightChange(index: number) {
    //let qty = this.cartForm.get('qty')?.value;
    let qty = <HTMLInputElement>document.getElementById('weight_' + index);
    //alert('qtyChange'+ qty.value);
    this.posHomeCart.product[index].quantity = qty.value;

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

/* ************************************************************** */


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


  whatsAppMsg(): void {

    if (!this.whatsappFlag) {



      //Swal.fire('WhatsApp Msg', 'Sending Receipt to WhatsApp', 'success');
      var whatsAppMessage = "Dear Customer, Thanks for shopping at niks. Please download your E-Bill from link below. \n";




      var dataURI = "iVBORw0KGgoAAAANSUhEUgAAAUwAAACICAYAAACMYNJJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAXxaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA2LjAtYzAwMiA3OS4xNjQ0NjAsIDIwMjAvMDUvMTItMTY6MDQ6MTcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDQtMDJUMjI6MjU6MTgrMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDQtMDJUMjI6MjU6MTgrMDU6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTA0LTAyVDIyOjI1OjE4KzA1OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmM2MjQwNTFiLTAxMmItZmE0Yi05MDAyLTRlMjBhNDY5ZDA4OCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjhiZDE0OWYzLWYwZDUtNzQ0OS1hOTdlLTRkYzY4MjE1MjI0MCIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjI0YjEwZTYwLTM1NzAtYWE0NS1iYzdiLWFmNzc2Njg3NmQ4ZCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjRiMTBlNjAtMzU3MC1hYTQ1LWJjN2ItYWY3NzY2ODc2ZDhkIiBzdEV2dDp3aGVuPSIyMDI0LTA0LTAyVDIyOjI1OjE4KzA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmM2MjQwNTFiLTAxMmItZmE0Yi05MDAyLTRlMjBhNDY5ZDA4OCIgc3RFdnQ6d2hlbj0iMjAyNC0wNC0wMlQyMjoyNToxOCswNTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PquEEMgAAFl2SURBVHhe7Z0HYBRV14bf7bvpPST0XlQUEZCqIAjSBFRAQMWKYtdfEXv77L2jggqigoogiiBFilKV3ntLIL1sNtm+/zl3ZpJN2CQbSELQeWAyM3dmp9/3nnOrxkdARUVFRaVStPJcRUVFRaUSVMFUUVFRCRJVMFVUVFSCRBVMFRUVlSBRBVNFRUUlSFTBVFFRUQkSVTBVVFRUgkQVTBUVFZUgUQVTRUVFJUhUwVRRUVEJElUw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";
      //var whatsappUrl = `https://wa.me/` +  this.customer.phone1 +`?text=`+encodedURI;
      var encodedURI = encodeURI(whatsAppMessage);
      var imageUri = this.dataURItoBlob(dataURI);

      var phone = environment.whatsappPhone;//+14165759062

      var url = `https://api.whatsapp.com/send?phone=$phone&text=` + encodedURI;

      let popupWin;

      popupWin = window.open(url, '_blank');


    }

  }
  dataURItoBlob(dataURI: any) {
    var byteString = dataURI;//atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }



  /* ******************************************************************************** */

  calculateFooterBalance(): void {

    let cashPaid = parseFloat(this.result) || 0;
    let cashDiscount = parseFloat(this.totalDiscount) || 0;
    this.posHomeCart.discount = cashDiscount;
    //let invoiceTotal = Number(this.priceSummary.total) || 0;


    if (this.showTaxFlag) {
      this.customerBalance = (this.posHomeCart.subTotal - cashDiscount + this.posHomeCart.taxes);
    }
    else {
      this.customerBalance = (this.posHomeCart.subTotal - cashDiscount);
    }

    this.posHomeCart.total = this.customerBalance;
    this.posHomeCart.total = Number(this.posHomeCart.total);

  }


  /* ******************************************************************************** */
  calculateBalance(): void {

    let cashPaid = parseFloat((this.result)) || 0;
    //let cashDiscount = parseFloat(this.totalDiscount) || 0;
    //this.priceSummary.discount = cashDiscount;
    //let invoiceTotal = Number(this.priceSummary.total) || 0;

    //this.priceSummary.grandTotal = invoiceTotal - (this.priceSummary.tax + cashDiscount);
    // Calculate the balance
    this.customerBalance = cashPaid - (this.posHomeCart.total);

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
    let data = localStorage.getItem('posHomeCart');
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
              return;
            }
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
                  else {
                    Swal.fire('IMPORT FAILED', ' Import of Items Failed', 'warning');
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

      // case 'F5':
      //   //alert('card sale for F5');
      //   this.openCardModal();
      //   break;
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
          this.createCheckout('CASH');
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
          //this.appendToResult(event.key);
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
      let found = false;
      if (agent !== undefined || agent !== '') {
        for (let i = 0; i < this.salesAgentList.length; i++) {
          if (this.salesAgentList[i].loginId === agent) {
            this.selectedAgent = this.salesAgentList[i];
            found = true;
            //this.cache.set("selectedAgent", JSON.stringify(this.selectedAgent));
          }
        }//for loop
        if (!found) {
          Swal.fire('WARNING', 'Agent not found', 'warning');
        }
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
        let sizeOfPhone = phone.length;
        if (sizeOfPhone < 10) {
          Swal.fire('WARNING', 'Customer Phone must be 10 Numeric characters', 'error');
        }

        this.focusAgent(true);

      }
    }
  }
  /* **************************************************** */
  focusAgent(focusFlag: boolean) {
    let agentInput = <HTMLInputElement>document.getElementById('selectAgentInput');

    if (agentInput === null) {
      return;
    }

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
    if (upcInput === null) return;

    if (focusFlag && upcInput !== null) {
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

    this.posHomeCart.product[row].price = priceInput.value;
    let price = priceInput.value;


    //price = price * this.posHomeCart.product[row].quantity;

    //discountVal = Number((Number(discountInput.value) * price) / 100);

    let posHomeCartData = localStorage.getItem('posHomeCart');
    if (posHomeCartData) {
      let discountData = JSON.parse(posHomeCartData);
      discountData.product[row].price = priceInput.value;
      localStorage.setItem('posHomeCart', JSON.stringify(discountData))


    }


    this.priceCalculationPerRow(row);
    this.priceCalculationTotal();
    this.productService.localAddToCart(this.posHomeCart);

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

    this.posHomeCart.product[row].discount = discountInput.value;
    let price = this.getPrice(this.posHomeCart.product[row]);
    //  (this.posHomeCart.product[row].salePrice
    //   ? this.posHomeCart.product[row].salePrice
    //   : this.posHomeCart.product[row].unitPrice)

    price = price * this.posHomeCart.product[row].quantity;

    discountVal = Number((Number(discountInput.value) * price) / 100);

    let posHomeCartData = localStorage.getItem('posHomeCart');
    if (posHomeCartData) {
      let discountData = JSON.parse(posHomeCartData);
      discountData.product[row].discount = discountInput.value;
      discountData.product[row].discountVal = discountVal;
      localStorage.setItem('posHomeCart', JSON.stringify(discountData))


    }
    this.posHomeCart.product[row].discount = discountInput.value;
    this.posHomeCart.product[row].discountVal = discountVal;


    this.priceCalculationPerRow(row);
    this.priceCalculationTotal();
    this.productService.localAddToCart(this.posHomeCart);

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
    let price = (this.posHomeCart.product[row].salePrice
      ? this.posHomeCart.product[row].salePrice
      : this.posHomeCart.product[row].unitPrice)


    price = price * this.posHomeCart.product[row].quantity;

    let posHomeCartData = localStorage.getItem('posHomeCart');
    if (posHomeCartData) {
      let discountData = JSON.parse(posHomeCartData);
      discountData.product[row].discountVal = discountVal;
      let discountPercentage = (discountVal * 100) / price;

      discountData.product[row].discount = discountPercentage.toFixed(2);
      this.posHomeCart.product[row].discountVal = discountVal;
      discountInput.value = discountPercentage.toFixed(2);

      localStorage.setItem('posHomeCart', JSON.stringify(discountData))
    }

    //discountVal = Number((Number(discountInput.value) * price) / 100);
    this.posHomeCart.product[row].discount = discountInput.value;
    this.posHomeCart.product[row].discountVal = discountVal;

    this.priceCalculationPerRow(row);
    this.priceCalculationTotal();
    this.productService.localAddToCart(this.posHomeCart);

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

    let price = this.posHomeCart.product[row].price * this.posHomeCart.product[row].quantity;
    let discountVal = 0;

    if (discount === undefined) {
      discount = 0;
    }

    discountVal = (discount * price) / 100;
    this.posHomeCart.product[row].discountVal = discountVal;

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

    if (this.selectedAgent === undefined || this.selectedAgent === '') {
      Swal.fire('Agent Required', 'Please select an Agent', 'warning');
      return;
    }

    this.addItemsToCart(product);

    /*
    let posHomeCartData = localStorage.getItem('posHomeCart');
    if (posHomeCartData) {
      let cartData = JSON.parse(posHomeCartData);
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
      localStorage.setItem('posHomeCart', JSON.stringify(cartData));
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

      this.posHomeCart.product.push(product);
      localStorage.setItem('posHomeCart', JSON.stringify(this.posHomeCart));
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
        if (orderCustomer !== null) {
          let orders: any = new Orders();
          if (data.orderCustomer.length > 0) {
            orders = data.orderCustomer[0].orders;
            let customer: any = data.orderCustomer[0]?.customer;
            let orderItems = data.orderItems;

            this.printThermalLastBill(orders, customer, orderItems);

          }
          else {
            Swal.fire('WARNING', 'No Last Bill of Sale Found', 'warning')
            return;
          }

        }
        else {
          Swal.fire('WARNING', 'No Last Bill of Sale Found', 'warning')
          return;
        }

      }
      else {
        Swal.fire('WARNING', 'No Last Bill of Sale Found', 'warning')
        return;
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
      else {
        mainImage = `assets/images/logos/techmaci-logo.png`;
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
      <p ><b> TECHMACI </b><br>
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
      <td colspan="6" style="text-align: left;border-top: 1px solid #000;">` + this.currencySign + (Number(order.orderAmount)).toFixed(2) + ` </td>
      
      </tr>
      <tr>
      <td style="text-align: left;">Total Qty:</td>
      <td colspan="5" style="text-align: left;"> ` +
        totalQty +
        `</td>
      </tr>
      <tr>
      <td >Discount:</td>
      <td colspan="5" style="text-align: left;">` + this.currencySign + totalDiscount + ` </td>
      </tr> 
          <tr>
            <td >Tax:</td>
            <td colspan="5" style="text-align: left;">` + this.currencySign + ((Number(order.tax))).toFixed(2) + ` </td>
          </tr><tr> 
        <td ><b>Total: </b></td>
        <td colspan="5" style="text-align: left;"><b>` + this.currencySign + ((Number(order.grandTotal))).toFixed(2) + `</b> </td>
        </tr><tr>
        <td >Cash Paid:</td>
        <td colspan="5" style="text-align: left;">` + this.currencySign + this.result + ` </td>
        </tr><tr>
      <td style="text-align: left;border-bottom: 1px solid #000;" ><b>Customer Balance: </b></td>
      <td colspan="5" style="text-align: left;border-bottom: 1px solid #000;"><b>` + this.currencySign + (this.customerBalance).toFixed(2) + `</b> 
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
            <i class="fa fa-fw fa-phone"></i>+1 416 575 9062><br>
            <i class="fa fa-fw fa-envelope"></i>info@techmaci.com<br>
            <i class="fa fa-fw fa-map-pin"></i> 183 Ramblewood Drive, LaSalle, ON N9J3A7, CANADA
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

  getPrice(product: any): any {
    let price = 0;
    if (product.upc === '00448666') {
      price = product.price;
    }
    else {
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

    if (this.posHomeCart.product.length === 0) return;

    let priceWithQty = this.posHomeCart.product[row].price * this.posHomeCart.product[row].quantity;

    if (this.showTaxFlag) {
      if (this.posHomeCart.product[row].discount === undefined) {
        this.posHomeCart.product[row].discount = 0;
      }

      if (this.posHomeCart.product[row].discountVal === undefined) {
        this.posHomeCart.product[row].discountVal = 0;
      }
      let priceMinusDiscount=0;
      if (this.useItemDiscountValue){
        priceMinusDiscount = (priceWithQty) - Number(this.posHomeCart.product[row].discountVal);
      }
      else{
        priceMinusDiscount = (priceWithQty);
      }
      
      this.posHomeCart.product[row].totalTax = ((priceMinusDiscount) * this.posHomeCart.product[row].tax) / 100;
      this.posHomeCart.product[row].totalPrice = ((Number(priceMinusDiscount) + this.posHomeCart.product[row].totalTax).toFixed(2));

    }
    else {
      if (this.posHomeCart.product[row].discount === undefined) {
        this.posHomeCart.product[row].discount = 0;
      }

      if (this.posHomeCart.product[row].discountVal === undefined) {
        this.posHomeCart.product[row].discountVal = 0;
      }
      if (this.useItemDiscountValue){
          this.posHomeCart.product[row].totalPrice = ((Number((priceWithQty) - Number(this.posHomeCart.product[row].discountVal))).toFixed(2));
      }
      else{
          this.posHomeCart.product[row].totalPrice = Number(priceWithQty) ;
      }


  
    }




  }

  /* ************************************************************** */
    priceCalculationTotal(): void {

    if (this.posHomeCart.product.length === 0) return;

    this.posHomeCart.totalItems = this.posHomeCart.product.length;

    let finalPrice = 0;
    //let row = -1;

    //Reset totals in pickCart
    this.posHomeCart.totalQty = 0;
    this.posHomeCart.subTotal = 0;
    this.posHomeCart.total = 0;


    if (this.showTaxFlag) {

      for (let row = 0; row < this.posHomeCart.product.length; row++) {
        let totalTax = 0, totalDiscount = 0, total = 0, grandTotal = 0, totalQty = 0, totalPrice = 0;


        // totalTax = Number(this.posHomeCart.product[row].totalTax);
        // this.priceSummary.tax += Number(totalTax);

        // if (this.posHomeCart.product[row].discountVal === undefined) {
        //   this.posHomeCart.product[row].discountVal = 0;
        // }

        // totalDiscount = Number(this.posHomeCart.product[row].discountVal);
        // this.priceSummary.discount += Number(totalDiscount);

        totalQty = Number(this.posHomeCart.product[row].quantity);
        this.posHomeCart.totalQty += Number(totalQty);

        total = Number(this.posHomeCart.product[row].price * totalQty);
        this.posHomeCart.subTotal += Number(total);

        // totalPrice = Number(this.posHomeCart.product[row].price * totalQty);
        // this.priceSummary.totalWithoutDiscount += totalPrice;

        this.posHomeCart.total += Number(this.posHomeCart.product[row].totalPrice);

      }//for loop


    }
    else {
      for (let row = 0; row < this.posHomeCart.product.length; row++) {
        let totalTax = 0, totalDiscount = 0, total = 0, grandTotal = 0, totalQty = 0, totalPrice = 0;

        if (this.posHomeCart.product[row].discountVal === undefined) {
          this.posHomeCart.product[row].discountVal = 0;
        }

        // totalDiscount = Number(this.posHomeCart.product[row].discountVal);
        // this.priceSummary.discount += Number(totalDiscount);

        let qty = Number(this.posHomeCart.product[row].quantity);
        totalQty = qty;
        this.posHomeCart.totalQty += Number(totalQty);

        total = Number(this.posHomeCart.product[row].totalPrice);
        this.posHomeCart.subTotal += Number(total);

        // totalPrice = Number(this.posHomeCart.product[row].price * totalQty);
        // this.priceSummary.totalWithoutDiscount += totalPrice;

        this.posHomeCart.total += Number(this.posHomeCart.product[row].totalPrice);

      }//for loop
    }

    this.posHomeCart.total = (this.posHomeCart.subTotal - this.posHomeCart.discount) + this.posHomeCart.taxes;

    this.taxDiscountCalculations();

    localStorage.setItem('posHomeCart', JSON.stringify(this.posHomeCart));

  }


/* *************************************************************** */
  taxDiscountCalculations(){

    if (this.posHomeCart.discountPercentage===undefined || this.posHomeCart.discountPercentage===null){
      this.posHomeCart.discountPercentage=0;
    }
    if (this.posHomeCart.taxesPercentage===undefined || this.posHomeCart.taxesPercentage===null){
      this.posHomeCart.taxesPercentage=0;
    }

    if (this.useDiscountValue){
      this.posHomeCart.discount = this.customer.discountAmount;
    }
    else{
      this.posHomeCart.discount = (this.posHomeCart.discountPercentage * this.posHomeCart.subTotal)/100;
    }
    

    this.totalDiscount = this.posHomeCart.discount;
    this.totalDiscountPercentage = this.posHomeCart.discountPercentage;

    this.posHomeCart.taxes = (this.posHomeCart.taxesPercentage * this.posHomeCart.subTotal)/100;
    this.totalTaxValue = this.posHomeCart.taxes;
    this.totalTax = this.posHomeCart.taxesPercentage;

    this.posHomeCart.total = (this.posHomeCart.subTotal - this.posHomeCart.discount) + this.posHomeCart.taxes;

  }
  /* ************************************************************* */
  calculateTaxTotal(totalTax: any): any {
    //TAX

    this.posHomeCart.taxesPercentage = totalTax;
    //let netSale = (this.priceSummary.total  - this.priceSummary.discount);
    let netSale = (this.posHomeCart.subTotal - this.posHomeCart.discount);
    let taxValue = (netSale * totalTax) / 100;

    this.posHomeCart.total = netSale + taxValue;
    this.posHomeCart.taxes = taxValue;
    this.totalTaxValue = taxValue;

    this.productService.pickupAddToCart(this.posHomeCart);

  }



  openPartialModal() {
    this.partialModal = true;
  }
  closePartialModal() {
    this.partialModal = false;
    this.instalmentAmount = 0;
    this.selectedPaymentMethod = '';
    this.addPartialPaymentFlag = false;
    this.paymentList.length = 0;
    this.orderSearch = '';
    this.phoneSearch = '';
    this.multiPaymentListFlag = false;
    this.paymentMultiList.length = 0;

  }

  addPartialPayment() {
    this.addPartialPaymentFlag = true;

  }

  checkForPartialComplete() {

    //If partial payment found
    if (this.paymentList.length > 0) {
      this.showPartialPaymentFlag = true;
    }

    //But also check for any status = COMPLETED, if found, add partial amount should be disable
    for (let i = 0; i < this.paymentList.length; i++) {
      if (this.paymentList[i].paymentStatus === 'COMPLETED') {
        this.showPartialPaymentFlag = false;
      }
    }


  }

  billOfSaleSearch(event: any) {

    if (event.key === 'Enter') {
      let billOfSale = this.orderSearch; //qtyInput.value;
      if (billOfSale !== undefined || billOfSale !== '') {

        this.searchPartialPaymentByBOL();

      }
    }


  }

  custPhoneSearch(event: any) {
    if (event.key === 'Enter') {

      let phone1 = this.phoneSearch; //qtyInput.value;
      if (phone1 !== undefined || phone1 !== '') {
        this.searchPartialPaymentByPhone();

      }
    }
  }

  initPaymentMethodList() {
    let code: CodeMaster = new CodeMaster();
    code.code = 'CARD';
    this.paymentMethodList.push(code);

    code = new CodeMaster();
    code.code = 'CASH';
    this.paymentMethodList.push(code);

    code = new CodeMaster();
    code.code = 'EASYPAISA';
    this.paymentMethodList.push(code);

    code = new CodeMaster();
    code.code = 'JAZZCASH';
    this.paymentMethodList.push(code);
  }



  savePartialPayment() {
    let payment: Payment = new Payment();

    if (this.selectedPayment.orderId === null) {
      //pick 1st record from list
      this.selectedPayment = this.paymentList[0];
    }
    else if (this.selectedPayment.orderId === undefined) {
      //pick 1st record from list
      this.selectedPayment = this.paymentList[0];
    }
    payment = this.selectedPayment;
    payment.paymentId = null; //This is new Payment for Installation
    payment.instalmentAmount = this.instalmentAmount;
    payment.paymentMethod = this.selectedPaymentMethod;
    payment.currency = environment.currency;
    payment.remainingBalance = payment.remainingBalance - this.instalmentAmount;
    if (payment.remainingBalance === 0) {
      payment.paymentStatus = "COMPLETED";
    }

    this.paymentService.savePayment(payment).subscribe(data => {
      if (data != undefined) {
        let resp = data.statusCode;
        this.partialModal = false;
        this.addPartialPaymentFlag = false;
        this.closePartialModal();
      }
    });

  }

  selectedPayment: Payment = new Payment();

  onPaymentSelect(payment: Payment, foundRow: number) {
    this.selectedPayment = payment;

    if (this.multiPaymentListFlag) {
      for (let i = 0; i < this.paymentMultiList.length; i++) {
        let paymentRow = document.getElementById(`payment-row_${i}`);
        if (paymentRow !== null) {
          paymentRow.classList.remove('paymentRowSelected');
        }

      }
    }
    else {
      for (let i = 0; i < this.paymentList.length; i++) {
        let paymentRow = document.getElementById(`payment-row_${i}`);
        if (paymentRow !== null) {
          paymentRow.classList.remove('paymentRowSelected');
        }

      }
    }



    const paymentRow = document.getElementById(`payment-row_${foundRow}`);
    if (paymentRow) {
      paymentRow.classList.add('paymentRowSelected');
    }
  }

  closePriceCheck() {

    let qtyInput = <HTMLInputElement>document.getElementById('priceCheck');
    if (qtyInput === null || qtyInput === undefined) {
      this.priceCheckPopup = false;
      return;
    }
    let upc = qtyInput.value;
    qtyInput.value = '';
    this.productcheckList.length = 0;

    this.priceCheckPopup = false;


  }

  searchPartialPayment() {
    let phone1 = this.phoneSearch;
    let billOfSale = this.orderSearch;
    let found = true;
    if (phone1 !== undefined || phone1 !== '') {
      if (phone1 !== "") {
        this.searchPartialPaymentByPhone();
      }
      else {
        if (billOfSale !== undefined || billOfSale !== '') {
          if (billOfSale !== "") {
            this.searchPartialPaymentByBOL();
          }
          else {
            Swal.fire('ERROR', 'Please enter BOL or Customer Phone', 'error');
          }

        }
        else {
          Swal.fire('ERROR', 'Please enter BOL or Customer Phone', 'error');
        }
        // Swal.fire('ERROR', 'Please enter BOL or Customer Phone', 'error');
      }

    }
    else if (billOfSale !== undefined || billOfSale !== '') {
      this.searchPartialPaymentByBOL();
    }
    else {
      Swal.fire('ERROR', 'Please enter BOL or Customer Phone', 'error');
    }

  }
  searchPartialPaymentByBOL() {
    //reset other searches
    let found = true;
    let billOfSale = this.orderSearch;
    this.paymentMultiList.length = 0;
    this.phoneSearch = '';

    // let found = false;
    // let foundRow = 0;
    let payment: Payment = new Payment();
    //serach product by UPC
    this.paymentService.getPartialPaymentByBOS(billOfSale).subscribe((data) => {
      if (data === undefined) {
        Swal.fire(
          'Not Found',
          'Bill Of Sale does not exist.',
          'error'
        );
        found = false;
      }
      else if (data === null) {
        Swal.fire(
          'Not Found',
          'Bill Of Sale does not exist.',
          'error'
        );
        found = false;
      }
      // else if (data.length === 0) {
      //   Swal.fire(
      //     'Not Found',
      //     'Bill Of Sale does not exist.',
      //     'error'
      //   );
      // }

      if (found) {


        this.orderCustomerWrapper = data;
        this.paymentList = data.payment;



        if (this.paymentList === null) {
          Swal.fire(
            'Not Found',
            'Bill Of Sale does not exist.',
            'error'
          );
        }
        else {
          this.checkForPartialComplete();
        }
      }
    });

  }

  searchPartialPaymentByPhone() {
    //reset other searches
    let phone1 = this.phoneSearch;
    this.orderSearch = '';

    let found = true;
    // let foundRow = 0;
    //let productView: ProductView = new ProductView();
    //serach product by UPC
    this.paymentService.getPartialPaymentByCustPhone(phone1).subscribe((data) => {
      if (data === undefined) {
        Swal.fire(
          'Not Found',
          'No Partial Payment Found for this Customer',
          'error'
        );
        found = false;
      }
      else if (data === null) {
        Swal.fire(
          'Not Found',
          'No Partial Payment Found for this Customer',
          'error'
        );
        found = false;
      }
      if (data.length === 0) {
        Swal.fire(
          'Not Found',
          'No Partial Payment Found for this Customer',
          'error'
        );
        found = false;
      }
      if (found) {
        let orderCustomerWrapper = data;
        this.paymentMultiList = data;
        this.multiPaymentListFlag = true;

        if (this.paymentList === null) {
          Swal.fire(
            'Not Found',
            'No Partial Payment Found for this Customer',
            'error'
          );
        }
        else {
          this.checkForPartialComplete();
        }

      }

    });

  }

  truncateToTwoDecimals(value: any) {
    if (isNaN(value)) return null; // Check if the input is a valid number
    const parts = value.toString().split(".");
    if (parts.length < 2) return parts[0]; // No decimal part exists
    return parts[0] + "." + parts[1].substring(0, 2); // Truncate to 2 decimal places
  }


  saleReturns() {
    this.router.navigate([`saleReturns`]);
  }

  switch() {
    this.router.navigate([`posCards`]);
  }

  /* ***************************************** */

  formatTime(totalSeconds: number): string {

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return (
      this.pad(hrs) + ':' +
      this.pad(mins) + ':' +
      this.pad(secs)
    );
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  /* **************************************************** */
  /* ******************** CUSTOMER *********************** */
  /* ******************************************** */
  searchCustomerByPhone(phone: string) {

    this.customerService.searchByPhone(phone)
      .subscribe((data: any[]) => {

        this.customerSearchList = data;

      });

  }

  /* ******************************************* */
  onPhoneChange(value: string) {

    this.customer.phone1 = value;

    if (value && value.length >= 3) {
      // call API and fill customerSearchList
      this.searchCustomerByPhone(value);
    }
    else if (value.length === 0) {
      //reset current customer
      this.customer = new Customer();
      this.customer.custType = 'C';
      this.customer.priority = 1;
    }
    else {
      this.customerSearchList = []; // hide when too short
    }

    // Clear previous timeout
    //clearTimeout(this.searchTimeout);

    // Only search after 3+ digits
    // if (!value || value.length < 3) {
    //   this.customerSearchList = [];
    //   return;
    // }

    // // Debounce (300ms)
    // this.searchTimeout = setTimeout(() => {

    //   this.searchCustomerByPhone(value);

    // }, 300);

  }
  /* ******************************************* */
  selectCustomer(customer: Customer) {
    this.customer = { ...customer };        // fill form
    this.customerSearchList = [];    // 🔴 hide dropdown
    console.log('Discount% ' + this.customer.discountPercentage);
    //this.showCustomerPanel = false;  // 🔴 collapse panel (optional but recommended)

    //Apply Discount
    if (this.customer.discountPercentage === undefined || this.customer.discountPercentage === null) {
      this.customer.discountPercentage = 0;
    }
    else if (this.customer.discountPercentage > 0) {
      this.totalDiscountPercentage = this.customer.discountPercentage;
      this.totalDiscount = this.customer.discountAmount;
      this.posHomeCart.discountPercentage = this.customer.discountPercentage;
      this.priceCalculationTotal();
    }

    localStorage.setItem('customer', JSON.stringify(this.customer));
    this.toggleCustomer();


  }
  /* ******************************************* */
  toggleCustomer() {
    this.showCustomerPanel = !this.showCustomerPanel;
  }

  /* ******************************************* */

  validateCustomer(): boolean {

    let bRet = true;

    //Check if user has enter Customer Phone number entered, then validate user, otherwise take the default user
    if (this.customer.phone1) {
      //Check for Customer Data, selected from Shop
      // if (this.customer.phone1===undefined || this.customer.phone1==='' || this.customer.phone1===null){
      //   Swal.fire('WARNING', 'Please enter Phone', 'warning');
      //   return false;
      // }
      if (this.customer.custName === undefined || this.customer.custName === '' || this.customer.custName === null) {
        Swal.fire('WARNING', 'Please enter Customer Name', 'warning');
        bRet = false;
      }
      else if (this.customer.address === undefined || this.customer.address === '' || this.customer.address === null) {
        Swal.fire('WARNING', 'Please enter Address', 'warning');
        bRet = false;
      }
      else if (this.customer.city === undefined || this.customer.city === '' || this.customer.city === null) {
        Swal.fire('WARNING', 'Please enter City', 'warning');
        bRet = false;
      }
      else if (this.customer.stateProvince === undefined || this.customer.stateProvince === '' || this.customer.stateProvince === null) {
        Swal.fire('WARNING', 'Please enter Province', 'warning');
        bRet = false;
      }

      bRet = true;
    }

    return bRet;

  }

  /* ************************* This method gets called before each checkout ******************** */
  async checkUserEnterCustomer(): Promise<Customer> {

    let bRet = false;

    /* ************ Load Default Customer *************** */
    if (!this.customer) {

      const customerObj = localStorage.getItem('customer');

      if (customerObj) {

        this.defaultCustomer = JSON.parse(customerObj);
        this.customer = this.defaultCustomer;

      } else {

        try {

          const data = await firstValueFrom(
            this.customerService.getByCustName('pos')
          );

          this.defaultCustomer = data;
          this.customer = data;

          localStorage.setItem(
            'customer',
            JSON.stringify(this.defaultCustomer)
          );

        } catch (err) {
          console.error('Failed to load default customer', err);
        }
      }
    }

    /* ************ Check if user entered customer *************** */
    if (this.customer?.phone1) {

      bRet = true;

    } else {

      // Walk-In Customer
      try {

        const data = await firstValueFrom(
          this.customerService.getByCustName('pos')
        );

        this.defaultCustomer = data;
        this.customer = data;

        localStorage.setItem(
          'customer',
          JSON.stringify(this.defaultCustomer)
        );

      } catch (err) {
        console.error('Failed to load walk-in customer', err);
      }

      bRet = false;
    }

    /* ************ Save Customer *************** */
    if (bRet) {

      const customer = await this.addCustomer();

      if (!customer) {
        alert('Customer required');
        throw new Error('Customer required');
      }

      this.customer = customer;
    }

    return this.customer;
  }


  async checkUserEnterCustomer2(): Promise<Customer> {
    let bRet = false;//default Walk In Customer

    if (this.customer === null) {
      /* ************ Default Customer *************** */
      let customerObj = localStorage.getItem('customer');
      if (customerObj !== undefined) {
        this.defaultCustomer = JSON.parse(customerObj!);
        this.customer = this.defaultCustomer;
      }
      else {
        this.customerService.getByCustName('pos').subscribe((data: Customer) => {
          this.defaultCustomer = data;
          this.customer = this.defaultCustomer;

          localStorage.setItem('customer', JSON.stringify(this.defaultCustomer));
        });
      }



    }
    if (this.customer === undefined) {
      /* ************ Default Customer *************** */
      let customerObj = localStorage.getItem('customer');
      if (customerObj !== undefined) {
        this.defaultCustomer = JSON.parse(customerObj!);
        this.customer = this.defaultCustomer;
      }
      else {
        this.customerService.getByCustName('pos').subscribe((data: Customer) => {
          this.defaultCustomer = data;
          this.customer = this.defaultCustomer;

          localStorage.setItem('customer', JSON.stringify(this.defaultCustomer));
        });
      }

    }
    if (this.customer.phone1) {
      bRet = true;//Yes, user has entered Customer
    }
    else {
      //User did not eneter customer info, it means Walk-In Customer
      this.customerService.getByCustName('pos').subscribe((data: Customer) => {
        this.defaultCustomer = data;
        this.customer = this.defaultCustomer;

        localStorage.setItem('customer', JSON.stringify(this.defaultCustomer));
      });

      //      this.customer = this.defaultCustomer;
      bRet = false;
    }


    //User entered Customer Info, now validate and then Add/Edit Customer
    if (bRet) {
      // ⏳ WAIT for customer to be saved
      const customer = await this.addCustomer();

      if (!customer) {
        alert('Customer required');

      }
    }

    return this.customer;
  }

  /* ******************************************* */



  async addCustomer(): Promise<any> {

    // 1- Validate
    if (!this.validateCustomer()) {
      return null;
    }

    this.customer.loginId = 'walkin';
    this.customer.loginPassword = '123';

    try {

      const response: any = await firstValueFrom(
        this.customerService.saveCustomer(this.customer)
      );

      this.customer = response.customer;

      return this.customer; // ✅ return updated customer with custId

    } catch (error) {

      console.error('Customer save failed', error);
      return null;

    }

  }

  /* ************************************************************* */

  closeBalance() {
    this.closeBalanceFlag = true;
  }
  /* ************************************************************** */
  closeBalancePopup() {

    this.loginService.saveCloseBalance(this.cashierShift).subscribe(async (data) => {
      if (data.shiftId !== null) {
        //print sale report
        // this.getDailySale();
        const response = await this.printService.printDailyCloseSale();


        sessionStorage.setItem('cashierShift', '');
        window.location.reload();

      }

      this.closeBalanceFlag = false;
    });


  }
  /* **************************************************************** */
  /* ************************************************************* */
  calculateDiscountTotal(discount: number): any {

    //Discount is in %age
    console.log("Discount changed: ", discount);

    if (discount===undefined || discount===null){
      discount=0;
    }
    

    if (!this.useDiscountValue){
      this.posHomeCart.discountPercentage = discount;//%age
      this.posHomeCart.discount = (discount * this.posHomeCart.subTotal) / 100;
      this.posHomeCart.total = (this.posHomeCart.subTotal - (discount * this.posHomeCart.subTotal) / 100) + this.posHomeCart.taxes;
    }
    else{
      this.posHomeCart.discount = discount; //Value
      this.posHomeCart.total = this.posHomeCart.subTotal - discount + this.posHomeCart.taxes;
    }
    
    this.totalDiscount = this.posHomeCart.discount;

    
    // this.posHomeCart.total = (this.posHomeCart.subTotal - (discount * this.posHomeCart.subTotal) / 100) + this.posHomeCart.taxes;

    // this.posHomeCart.discount = this.posHomeCart.discount;

    //Save Cart in Cache
    this.productService.pickupAddToCart(this.posHomeCart);

  }

  /* ********************************************** */
  createCheckout(source: any) {
    // Check if any of the input fields are empty
    //Changes made for Partial Payments, Sep 22, 2024

    let posHomeCart = localStorage.getItem('posHomeCart')
    if (posHomeCart === undefined || posHomeCart === '' || posHomeCart === null || posHomeCart.length === 105 || posHomeCart.length === 0) {
      Swal.fire('WARNING', 'Cart is Empty', 'warning');
      return;
    }

    if (posHomeCart != null || posHomeCart != undefined) {
      this.posHomeCart = JSON.parse(posHomeCart);
      if (this.posHomeCart.product.length === 0) {
        Swal.fire('WARNING', 'Cart is Empty', 'warning');
        return;
      }
    }

    if (this.payment.paymentMethod === 'CASH') {
      /* *********************************************************** */
      if (this.result === "") {//0 Payment

        //check for RETURNS
        if (this.posHomeCart.total < 0) {
          Swal.fire({
            title: 'Warning for RETURN Payment',
            text: 'Payment is negative, do you want to proceed with Return Payment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No'
          }).then((response: any) => {

            if (!response.value) {

              return; // Don't proceed with saving    
            }
            else {
              this.payment.paymentStatus = 'COMPLETED';
              this.payment.instalmentAmount = 0;
              this.payment.remainingBalance = (this.posHomeCart.total);
              this.payment.discount = this.posHomeCart.discount;
              this.payment.customerPaid = this.result;

              //Create Sale Orders
              this.createSaleOrder();
            }
          });
        }
        else {
          Swal.fire({
            title: 'Warning for 0 Payment',
            text: 'Payment is 0, do you want to proceed with 0 Payment?',
            icon: 'warning'
          });
          return; // Don't proceed with saving    

        }

      }
      else if (this.result < this.posHomeCart.total) {

        Swal.fire({
          title: 'Warning for LOW Payment',
          text: 'Payment is Not Enough to Create Order',
          icon: 'warning'
        });
        return;

      }//end if amount is partial
      else {
        this.payment.paymentStatus = 'COMPLETED';
        this.payment.instalmentAmount = 0;
        this.payment.remainingBalance = 0;
        this.payment.discount = 0;
        this.payment.customerPaid = this.result;

        //Create Sale Orders
        this.createSaleOrder();

      }
    }//end if CASH
    else {
      this.result = this.posHomeCart.total;
      if (this.result < this.posHomeCart.total) {

        Swal.fire('WARNING', 'Payment is Not Enough', 'warning');

        Swal.fire({
          title: 'Warning for LOW Payment',
          text: 'Payment is Not Enough, do you want to proceed with Partial Payment?',
          icon: 'warning',
        });
        return; // Don't proceed with saving    




      }//end if amount is partial
      else {
        this.payment.paymentStatus = 'COMPLETED';
        this.payment.instalmentAmount = 0;
        this.payment.remainingBalance = 0;
        this.payment.discount = 0;
        this.payment.customerPaid = this.result;
        //Create Sale Orders
        this.createSaleOrder();

      }

    }
    this.cashModal = false;
  }

    /* ****************************************** */
  async createSaleOrder() {
    //this.payment.paymentMethod = source;
    this.payment.discount = this.posHomeCart.discount;
    if (this.showTaxFlag) {
      this.payment.taxesAmount = this.posHomeCart.taxes;
    }
    else {
      this.payment.taxesAmount = 0;
    }

    this.payment.totalAmount = this.posHomeCart.total;
    this.payment.currency = environment.currency;
    this.payment.advanceAmount = 0;


    //This methods gets called from Guest Customer Data Entry form, when user click Checkout after entering his/her data.
    let customer = new Customer();

    //customer = this.defaultCustomer;
    customer = await this.checkUserEnterCustomer();

    if (customer===null){
          /* ************ Default Customer *************** */
      let customerObj = localStorage.getItem('customer');
      if (customerObj) {
        this.defaultCustomer = JSON.parse(customerObj);
      }
      else {
        this.customerService.getByCustName('pos').subscribe((data: Customer) => {
          this.defaultCustomer = data;

          localStorage.setItem('customer', JSON.stringify(this.defaultCustomer));
        });
      }
      customer = this.defaultCustomer;
    }


    this.commonCheckOut(this.posHomeCart, customer);


  }

    /* ***************** NEW Method to get Order Amount ********************* */
  getOrderAmount(order: Orders) {
    /* ******************* ITEMS LOOP ********************* */
    let orderAmount = 0;
    let discountVal = 0;
    this.posHomeCart.product.forEach((items) => {

      orderAmount += items.quantity * this.getPrice(items);
      //discountVal+=items.discountVal;
    });

    order.orderAmount = orderAmount;
    //order.discount = discountVal;

  }


  /* ***************** NEW Method to get Order Amount with Tax and Discount ********************* */
    async printBill() {
  
      if (this.posHomeCart.product.length === 0) {
        Swal.fire('WARNING', 'Cart is Empty', 'warning');
        return;
      }
      let dinInFlag = false;
      //This methods gets called from Guest Customer Data Entry form, when user click Checkout after entering his/her data.
      let customer = new Customer();
  
      customer = this.defaultCustomer;
      //customer = await this.checkUserEnterCustomer();
  
      this.payment.paymentStatus = 'COMPLETED';
      this.payment.instalmentAmount = 0;
      this.payment.remainingBalance = (this.posHomeCart.total);
      this.payment.discount = this.posHomeCart.discount;
      this.payment.taxesAmount = this.posHomeCart.taxes;
      this.payment.totalAmount = (this.posHomeCart.total);
      this.payment.customerPaid = 0;
  
      let billCopy = 1;//Print Bill force it 1 copy
  
      this.printService.printThermalRestaurant(customer,
        this.payment,
        this.posHomeCart,
        this.customerBalance,
        this.invoiceNumber,
        this.printTokenFlag,
        this.todaydatashow,
        this.orderNotes,
        dinInFlag,
        billCopy);
  
    }
  

  /* ************************** THE END ***************************************** */



}
