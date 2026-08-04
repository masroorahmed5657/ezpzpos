export interface signUp{
    name:string;
    email:string;
    password:string;
}
export interface login{
    email:string;
    password:string;
}

/*export class Product{
    productId: any;
    custId: any;
    productName: any;
    productDetails: any;
    unitPrice: any;
    categoryId: any;
    packagingAttributes: any;
    cuttingAttributes: any;
    extraAttributes: any;
    discount: any;
    popularFlag: any;
    productStatus?: any;
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

    sku: any;
    upc: any;
    brandId: any;

 }*/

export class  product{
    productId?: number;
    custId?: number;
    productName?: string;
    productDetails?: string;
    unitPrice: any;
    salePrice:any;
    wholesalePrice:any;
    categoryId?: number;
    category?: any;
    subCategory?: any;
    packagingAttributes: any;
    cuttingAttributes: any;
    optionsAttributes: any;
    extraAttributes: any;
    discount?: number;
    popularFlag?: number;
    productStatus?: string;
    updatedBy?: any;
    updatedDate?: any;
    productImage: any;
    imageMimeType: any;
    quantity:any
    brandId: any;
    brandName?: any;
    notes:any;
    unitName:any;
    sellinPcs: any
    instockFlag: any;
    imageFilename: any;
    imageCharset: any;
    madeinFlag: any;
    sku: any;
    upc: any;

}


export class ProductView{
    productList(productList: any): import("./model/model-classes.model").ProductView[] {
      throw new Error('Method not implemented.');
    }
    productId?: number;
    custId?: number;
    productName?: string;
    productDetails?: string;
    unitPrice?: any;
    categoryId?: number;
    category?: any;
    subCategory?: any;
    packagingAttributes: any;
    cuttingAttributes: any;
    extraAttributes: any;
    optionsAttributes:any;
    discount?: number;
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
    brandId: any;
    showFlag:any;
    unitName:any;
    sellinPcs: any
 }

export class ProductWrapper{
    productMap: Map<number, any>=new Map<number, any>();
    imageMap?: Map<number, any>;
    productList: any;
 }

 export enum ItemType{
    RETURN = 'RETURN', 
    ISSUE = 'ISSUE'
 }

 export enum SettlementMethod{
    CASH = 'CASH', 
    CARD = 'CARD', 
    WALLET = 'WALLET',
    CREDIT_NOTE = 'CREDIT_NOTE'
 }

 export enum AdjustmentType{
    RETURN = 'RETURN', 
    EXCHANGE = 'EXCHANGE'
 }

 export enum SalesAdjustmentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum SettlementStatus{
    EVEN='EVEN', 
    CUSTOMER_PAY = 'CUSTOMER_PAY', 
    STORE_PAY = 'STORE_PAY'
}

 export class SalesAdjustments{
    adjustmentId:any;
    orderId:any;
    adjustmentNo:any;
    adjustmentType!:AdjustmentType;
    adjustmentDate:any;
    returnAmount:any;
    issueAmount:any;
    netAmount:any;
    settlementStatus!:SettlementStatus;
    reason:any;
    status!:SalesAdjustmentStatus;
    createdBy:any;
    createdDate:any;
 }

 export class SalesAdjustmentItems{
    adjustmentItemId:any;
    adjustmentId:any;
    productId:any;
    orderItemId:any;
    itemType!:ItemType;
    qty:any;
    unitPrice:any;
    totalAmount:any;
    productName:any;
    upc:any;
 }

 export class AdjustmentSettlements{
    settlementId:any;
    adjustmentId:any;
    settlementMethod:any;
    amount:any;
    settlementDate:any;

 }