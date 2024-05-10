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

