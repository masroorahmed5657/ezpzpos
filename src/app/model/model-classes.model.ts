
export class UserLoginResponse{
  adminUser?: AdminUser;
  authenticated?: boolean;
 authMessage?: string;
 token?: string;
  newCustomer?: boolean;
  customer?: Customer;
}

export class AdminUser{
  userId!: number | 0;
  loginId?: any;
  loginPassword?: any;
  firstName?: string;
  lastName?: string;
  email?: string;
  userRole?: string;
}

export class ProductWrapper{
  productMap: Map<number, any>=new Map<number, any>();
  imageMap?: Map<number, any>;
  productList: any;
}


export class ProductImage{
  imageId?: number;
  productId?: number;
  firstImage: any;
  finalImage: any;
  fileName?: string;
  filePath?: string;
  sortOrder?: number;
  displayFlag?: string;
  fileType?: string;
}

export class Product{
  productId?: number;
  custId?: number;
  productName?: string;
  productDetails?: string;
  unitPrice: any;
  categoryId?: number;
  packagingAttributes: any;
  cuttingAttributes: any;
  extraAttributes: any;
  discount?: number;
  popularFlag?: number;
  productStatus?: string;
  wholesalePrice: any;
  salePrice: any;
  purchasePrice: any;
  weight: any;
  physicalDimension: any;
  quantity: any;
  madein: any;
  optionsAttributes: any;
  instockFlag: any;
  imageMimeType: any;
  imageFilename: any;
  imageCharset: any;
  productImage: any;
  updatedBy?: any;
  updatedDate?: any;
  madeinFlag: any;
  sku: any;
  upc: any;
  notes: any;
  unitName:any;
  sellinPcs: any;
  taxExemptFlag:any;
  total: any;
  subCategory: string | undefined;
  id: any;
  tax:any;
  createdBy:any;
  createdDate:any;
  hsn:any;

}


export class ProductView{
  productId?: number;
  custId?: number;
  productName?: string;
  productDetails?: string;
  unitPrice: any;
  categoryId?: number;
  category?: any;
  subCategory?: any;
  packagingAttributes: any;
  cuttingAttributes: any;
  extraAttributes: any;
  optionsAttributes:any;
  discount?: any;
  popularFlag?: number;
  productStatus?: string;
  updatedBy?: any;
  updatedDate?: any;
  productImage: any;
  imageMimeType: any;
  madein: any;
  sku: any;
  upc: any;
  purchasePrice: any;
  wholesalePrice: any;
  salePrice: any;
  quantity: any;
  physicalDimension: any;
  weight: any;
  instockFlag: any;
  showFlag: any;
  unitName:any;
  sellinPcs: any;
  brandId: string | undefined;
  notes: string | undefined;
  imageFilename:any; // Fill with default value or retrieve from somewhere
   imageCharset:any; // Fill with default value or retrieve from somewhere
   madeinFlag: any;
   tax:any;
   agentId:any;
   loginId:any;
   firstName:any;
   discountVal:any;
   totalPrice:any;
   totalTax:any;
   price:any;
   createdBy:any;
   createdDate:any;
   hsn:any;
}

export class ProductDocuments{
  docId: any;
  productId: any;
  doc1: any;
  finalImage: any;
  fileName: any;
  filePath: any;
  sortOrder: any;
  displayFlag: any;
  fileType: any;
}


export class Customer{
  custId?: number;//	   cust_id  int(11) NOT NULL,
  custName?: string;	   //cust_name  varchar(100) NOT NULL,
  firstName?: string;
  lastName?: string;
  businessFlag?: boolean;
 email?: string;
 custType?: string;	 //  cust_type  varchar(20) NOT NULL,
 phone1?: string;
 phone2?: string;
 custPic: any; //	   cust_pic  blob  NULL;
 profession?: string;
 priority?: number;
 joiningDate: any;	  // joining_Date  datetime  NULL,
 bestWay?: string;   //best_way  varchar(50) NULL,
 bestTime: any; //	   best_time  time NULL,
 sendSmsFlag?: boolean; //	   send_sms_flag  tinyint(1)  NULL,
 sendEmailFlag?: boolean; //	   send_email_flag  tinyint(1) NULL,
 loginId?: string;
 loginPassword?: string;
 updatedBy?: string;	   //upDated_by  varchar(30)  NULL,
 updatedDate: any; //	   upDated_Date  datetime  NULL
 address: any;
 city: any;
 stateProvince: any;
 country: any;
 postalCode: any;
 createdDate: any;
 createdBy: any;
 subsExpiry: any;
 subsPlan: any;

}
export class CustomerType{
  custType?: string;
  description?: string;
}

export class Address{
  addressId?: number;
  custId?: number;
  addressOne?: string;
  addressTwo?: string;
  city?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  primaryFlag?: boolean;
}

export class CustomerRequest{
  custId?: number;//	   cust_id  int(11) NOT NULL,
  custName?: string;	   //cust_name  varchar(100) NOT NULL,
  firstName?: string;
  lastName?: string;
  businessFlag?: boolean;
  email?: string;
  custType?: string;	 //  cust_type  varchar(20) NOT NULL,
  phone1?: string;
  phone2?: string;
  custPic: any; //	   cust_pic  blob  NULL;
  profession?: string;
  priority?: number;
  joiningDate: any;	  // joining_Date  datetime  NULL,
  bestWay?: string;   //best_way  varchar(50) NULL,
   bestTime: any; //	   best_time  time NULL,
  sendSmsFlag?: boolean; //	   send_sms_flag  tinyint(1)  NULL,
  sendEmailFlag?: boolean; //	   send_email_flag  tinyint(1) NULL,
 loginId?: string;
 loginPassword?: string;
 updatedBy?: string;	   //upDated_by  varchar(30)  NULL,
 updatedDate: any; //	   upDated_Date  datetime  NULL
 address: any;
 city: any;
 stateProvince: any;
 country: any;
 postalCode: any;
 createdDate: any;
 createdBy: any;
 subsExpiry: any;
 subsPlan: any;
}

export class CustomerResponse{
  customer: any;
  statusCode: any;
  statusDesc: any;
}

export class CodeMaster{
  code?: string;
  description?: string;
}


export class MessageQ{
  msgId?: number;
  message?: string;
  duration?: any;
  durationView?: string;
}

export class ResponseFile{
  name!: string;
  url!: string;
  type!: string;
  size!: number;
  finalImage: any;
}
export class Category{
  categoryId?: number;
  category?: string;
  subCategory?: string;
  updatedBy: any;
  updatedDate: any;
  activeFlag:any;
  finalImage:any;
}

export class Orders{
  orderId?:number;
  orderNum:any;
  custId?:number;
  orderType?:any;
  createDate?:any;
  orderDetail?:any;
  category?:any;
  orderStatus?:any;
  reasonForReturn?:any;
  shippingDetail?:any;
  trackingNo?:any;
  productId?:number;
  price?:any;
  updatedBy?:any;
  updatedDate?:any;
  expiryDays?:any;
  representative: any;
  address: any;
  apartment: any;
  city: any;
  stateProvince: any;
  country: any;
  postalCode: any;
  deliveryDate: any;
  notes: any;
  pickupType: any;
  pickupTime:any;
  orderAmount:any;
  tax:any;
  shippingHandling:any;
  grandTotal:any;
  discount:any;
  custPhone:any;
  custEmail:any;
  branchName:any;
  posName:any;
  invoiceNumber:any
  fbrInvoiceNumber:any;
}

export class OrdersItems {

 orderId?: number; //   order_id  int(11) NOT NULL,
 orderItemId?: number; //   order_item_id  int(11) NOT NULL,
 productId?: number; //   product_id  int(11)  NULL,
 unitPrice: any; //   unit_price  double  NULL,
 quantity?: number;
 weight?: number;
 liter?: number;
 measuringUnit?: string;
 discount: any;
 itemStatus?: string;
  updatedBy: any;
  notes:any;
  attributes: any;
  pickupType:any;
  agentId:any;
  taxAmount:any;
  totalPrice:any;
  discountValue:any


}

/*
export class Product{
  productId?: number;
  custId?: number;
  productName?: string;
  productDetails?: string;
  unitPrice: any;
  categoryId?: number;
  packagingAttributes: any;
  cuttingAttributes: any;
  extraAttributes: any;
  discount: any;
  popularFlag?: number;
  productStatus?: string;
  wholesalePrice: any;
  salePrice: any;
  purchasePrice: any;
  weight: any;
  physicalDimenstion: any;
  quantity: any;
  madein: any;
  optionsAttributes: any;
  instockFlag: any;
  imageMimeType: any;
  imageFilename: any;
  imageCharset: any;
  productImage: any;
  updatedBy?: any;
  updatedDate?: any;
}
*/

export class OrdersWrapper{
  orders: any;
  orderMap: any; // = new HashMap<Integer, OrderProductWrapper>();//Key = orderId, Value=Order+Product+Category

}


export class OrdersCustomerWrapper {

  orders?: Orders;
  customer?: Customer;
  orderItems:OrderItemProductWrapper[]=[];

}
export class OrderItemProductWrapper {
  ordersItems?: OrdersItems;
  category?: Category;
  products?: Product;
}
export class ApiResponse  {
  statusCode?: number;
  statusDesc?: string ;
}

export class OrderResponse extends ApiResponse{
  orderCustomer: OrdersCustomerWrapper[]=[];
  orderItems: OrderItemProductWrapper[]=[];
}

export class OrderSaveResponse extends ApiResponse{
  orders?: Orders;
  orderItems: OrdersItems[]=[] ;
  payment: Payment = new Payment();
  fbrInvoiceNumber:any;
  barcodeResp: BarcodeResponse = new BarcodeResponse;
  showTaxFlag:any;
  taxCouponFlag:any;
}

export class BarcodeResponse extends ApiResponse{
  image: any;
  qrcode:any;
  imageType:any;
}



export class ProductSearch {
  custId: any;
  categoryId: any;
  popularFlag: any;
  status: any;
  inStockFlag: any;

}
export class OrderSearch {

  status: any;
  custId: any;
  createdDateStart: any;
  createdDateEnd: any;
  categoryId: any;
  productId: any;
  orderNumber: any;

}

export interface signUp{
  name:string;
  email:string;
  password:string;
}
export interface login{
  email:string;
  password:string;
}
export class Quantity{
  productQuantity:any
}

export interface PriceSummary{
  price:number,
  discount:number,
  tax:number,
  delivery:number,
  total:number,
  grandTotal:number,
  totalQty:number,
  totalWithoutDiscount:number,
  totalItems:number
}

export interface Cart{
  name:string,
  unitPrice:number,
  category:string,
  color:string,
  image:string,
  description:string,
  id:number| undefined,
  quantity:undefined | number,
  productId:number,
  userId:number
}

export class Departments{
  deptId: any;
  deptName: any;
  activeFlag: any;
  printerName: any;
  updatedDate: any;
  updatedBy: any;
  finalImage:any;
}

export class OrdersItemsView {
 orderId?: number; //   order_id  int(11) NOT NULL,
 orderItemId?: number; //   order_item_id  int(11) NOT NULL,
 productId?: number; //   product_id  int(11)  NULL,
  productName: any;
 unitPrice: any; //   unit_price  double  NULL,
 quantity?: number;
 weight?: number;
 liter?: number;
 measuringUnit?: string;
 discount: any;
 itemStatus?: string;
  updatedBy: any;
  categoryName: any;
  showItem: any;
  attributes: any;
  notes: any;
  pickupType:any;
}

export class Brands{
  brandId: any;
  brandCode: any;
  brandName: any;
}

export class ProductAttributes{
  code: any;
  description:any;
}

export class AlertMessage{
  message: any;
}

export class NewsTracker{
  newsId: any;
  news: any;
  site: any;

}
/* ****************************** */
export class ContactForm{

  name?:string;
  email?:string;
  phone?:string;
  address?:string;
  subject?:string;
  querydata?:string;
  service?:string;
}

export class StoreHours{
  sortOrder:any
  days: any;
  storeOpen: any;
  storeClose: any;
}

export class CheckOutCreditCardPayment{
  name: any;
  currency: any;
  amount: any;
  quantity:any;
  cancelUrl: any;
  successUrl: any;
}

export class OrderEmailForm{

  name?:string;
  email?:string;
  phone?:string;
  address?:string;
  subject?:string;
  querydata?:string;
  service?:string;
  orderId:any;
  orderNum:any;
}

export class Review{
 reviewId:any;
 custId:any;
 productId:any;
 rating:any;
 reviewTitle:any;
 reviewMsg:any;
 reviewDate:any;

}

export class Subscription{
  subscriptionId:any;
  name:any;
  description:any;
  price:any;
  billingInterval:any;
  duration:any;
  features:any;

  }

export class EzpzTax{
  taxId:any;
  name:any;
  tax:any;
  taxType:any
  stateCode:any;

}

export class PaymentRequest{
  token:any;
  amount: any;
  payment: Payment = new Payment;
}

export class Payment{
  paymentId:any;
 orderId:any;
 totalAmount:any;
 advanceAmount:any;
 taxesAmount:any;
 status:any;
 paymentMethod:any;
 paymentStatus:any;
 discount:any;
 dicountReasoning:any;
 discountType:any;
 updatedBy:any;
 updatedDate:any;
 currency:any;
 instalmentAmount:any;
 instalmentDate:any;
 remainingBalance:any;

}

export class StripeCardResponse{
  cardInfo:any;
  payment:Payment=new Payment();
  statusCode:any;
  statusDesc:string='';

}

export class Country{
  countryId?: string;
  countryCode?: string;
  name?: string;
}


export class StateProvince{
  stateId: any;
  countryId: any;
  countryCode:any;
  stateCode:any;

}
export class City {
  cityId: any;
  stateId: any;
  countryId: any;
  countryCode: any;
  city:any;
}

export class CountryStateProvince{
  cpsId?: number;
  stateProvince?: string;
  city?: string;
  countryCode?: string;
  countryName?: string;
}

export class CartHold{
 transactionId:any;

 subTotal:any;
 shipping:any;
 taxes:any;
 dicsount:any;
 total:any;
 price: any;
 totalQty:any;

 product:ProductView[]=[];
 customer:Customer = new Customer();
 cartData: any;

}
export class OrderSaleReport{
  orderType:any;
  totalSale:any;
  totalCount:any;
  dateStr:any;
  dayStr:any;
  totalTax:any;
  year:any;
  month:any;
  categoryId:any;
  category:any;
  subCategory:any;
  invoiceNumber:any;

}
export class OrderSaleDailyReport {
  orderId:any;
  orderNum:any;
  paymentMethod:any;
  orderAmount:any;
  tax:any;
  grandTotal:any;
  discount:any;
  advanceAmount:any;
  dateStr:any;
  phone1:any;
  invoiceNumber:any;
  paymentStatus:any;
}

export class PaymentMethodResponse{
  paymentCountMap:any;
  paymentAmountMap:any;
  paymentTaxesMap:any

}
export class PaymentMethodReport{
  cashCount:any;
  cardCount:any;
  cashAmount:any;
  cardAmount:any;
  cashTax:any;
  cardTax:any;

}


export class OrderSaleReportResponse{
  orderSaleReport: OrderSaleReport[]=[];
  orderSaleDailyReport: OrderSaleDailyReport[]=[];
  orderSaleDailyReturnReport: OrderSaleDailyReport[]=[];
  totalCashSaleCount:any;
  totalCashTax:any;
  totalCashSaleAmount:any;

  totalCreditSaleCount:any;
  totalCreditTax:any;
  totalCreditSaleAmount:any;
}

export class DailySale{
  id:any;
  date:any;
  noOrder:any;
  totalRevenue:any;
  averageOrder:any;
  categoryName:any;

}

export class CategorySalePrice{
  categoryName:any;
  salePrice:any;
  noOrder:any;
}

export class WeeklySale{

 id:any;
 date:any;
 noOrder:any;
 totalRevenue:any;
 averageOrder:any;


}

export class MonthlySale{

 id:any;
 date:any;
 noOrder:any;
 totalRevenue:any;
 averageOrder:any;


}


export class YearlySale{
  id:any;
 date:any;
 noOrder:any;
 totalRevenue:any;
 averageOrder:any;



}


export class DailyProductSale{
 id:any;
 date:any;
 productName:any;
 saleQty:any;
 price:any;
}


export class WeeklyProductSale{
 id:any;
 date:any;
 productName:any;
 saleQty:any;
 price:any;
}

export class MonthlyProductSale{
 id:any;
 date:any;
 productName:any;
 saleQty:any;
 price:any;
}

export class YearlyProductSale{
 id:any;
 date:any;
 productName:any;
 saleQty:any;
 price:any;
}

export class DailyCategorySale{
  id:any;
  date:any;
  categoryName:any;
  saleQty:any;
  subcategoryName:any;
  price:any;
}

export class WeeklyCategorySale{
 id:any;
 date:any;
 categoryName:any;
 saleQty:any;
 subcategoryName:any;
 price:any;
}

export class MonthlyCategorySale{
 id:any;
 date:any;
 categoryName:any;
 saleQty:any;
 subcategoryName:any;
 price:any;
}

export class YearlyCategorySale{
 id:any;
 date:any;
 categoryName:any;
 saleQty:any;
 subcategoryName:any;
 price:any;
}

export class DailysubCategorySale{
 id:any;
 date:any;
 subcategoryName:any;
 saleQty:any;
 productName:any;
 price:any;
}

export class WeeklysubCategorySale{
 id:any;
 date:any;
 subcategoryName:any;
 saleQty:any;
 productName:any;
 price:any;
}

export class MonthlysubCategorySale{
 id:any;
 date:any;
 subcategoryName:any;
 saleQty:any;
 productName:any;
 price:any;
}

export class YearlysubCategorySale{
 id:any;
 date:any;
 subcategoryName:any;
 saleQty:any;
 productName:any;
 price:any;
}

export class TodayTotalearning{
  id:any;
  name:any;
  total:any;
}

export class WeeklyTotalearning{
 id:any;
 name:any;
 total:any;
}

export class MonthlTotalyearning{
id:any;
name:any;
total:any;
}

export class TotalCountSale{
  id:any;
  name:any;
 total:any;

}

export class TotalCountOrders{

 id:any;
 name:any;
total:any;

}

export class TotalCountProducts{
 id:any;
 name:any;
 total:any;

}

export class TotalCountSignup{
 id:any;
 name:any;
 total:any;
}

export class ReportRequest {
  reportType:any; 
  reportValue:any; 
  startDate:any;
  endDate:any;
  startTime:any;
  endTime:any;


}
export class DbUpdate {
  tableName:any;
  updateDate:any;
}

export class OrdersCustomerPaymentWrapper{
  orders: Orders = new Orders;
  customer: Customer = new Customer;
  payment:Payment[]=[];
}