import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Customer, CartHold, Payment, PriceSummary } from '../model/model-classes.model';
import { SalesAdjustmentItems } from '../data-type';


@Injectable({
  providedIn: 'root'
})
export class PrintService {

  //  customer: Customer = new Customer();
  private appName = environment.appName;
  private showAgent = environment.showAgentFlag;
  private currencySign = environment.currency;
  private showTaxFlag: boolean = true;
  private whatsappFlag: boolean = false;

  //payment: Payment = new Payment();
  result: any = '';
  // invoiceNumber: any = 'BL00012';
  todaydatashow: any = '';
  //cartDataList: CartHold = new CartHold();
  printThermalHTMLTag = '';
  // customerBalance: number = 0;
  term = environment.termHtmlTag;
  private contact = environment.contactHtmlTag;


  priceSummary: PriceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
    grandTotal: 0,
    totalQty: 0,
    totalWithoutDiscount: 0,
    totalItems: 0
  };



  constructor() { }



  /* ********************************************* */

  printThermal(customer: Customer, payment: Payment, cartDataList: CartHold, customerBalance: number, invoiceNumber: any): void {
    let popupWin;

    let logo = environment.logoName;

    popupWin = window.open('', '_blank');
    let myFlag = true;
    if (popupWin != null || popupWin != undefined) {
      //if (myFlag){

      //popupWin = window.open('', '_blank');

      customer.firstName = 'POSCustomer';

      let orderAddress =
        customer?.address +
        ',' +
        customer?.city +
        ',' +
        customer?.stateProvince +
        ',' +
        customer?.postalCode;


      let mainImage = logo;


      let myHtml01Tag = `
      <html> 
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge"> `;


      //Get Style CSS
      let styleTag = this.getStyle();

      let appName = environment.appName;
      let companyTag = environment.companyName;

      let titleHtmlTag =
        `<title>  ` + appName + `  Receipt </title>
    </head>    
    <body  onload="window.print();window.close();">
    <div class="recipt_container">  
      <div class="header">
      <img class="img-fluid img-thumbnail" src="` + mainImage + `" >`;


      let companyInfoHtmlTag = ``;

      //      if (this.showTaxFlag) {
      companyInfoHtmlTag = `	
        <div class="company_details">
          <p ><b> ` + appName + ` </b><br>
          </p>
          <br> ${companyTag}
        </div>
      `;
      //    }
      // else {
      //   companyInfoHtmlTag = `	
      //   <div class="company_details">
      //     <p ><b> Z GENERATIONS </b><br>
      //       <span class="strn">NTN:8057991-3</span>
      //     </p>
      //   </div>
      // `;
      // }

      let cardCash = '';
      if (payment.paymentMethod === 'CASH') {
        cardCash = `<tr>
          <td >Cash Paid:</td>
          <td colspan="5" style="text-align: left;"> ` + this.currencySign +
          (Number(this.result)).toFixed(2) +
          ` </td>
          </tr>`;

      }
      else if (payment.paymentMethod === 'CARD') {
        cardCash = `<tr>
          <td >Paid by Card</td>
          <td colspan="5" style="text-align: left;"> &nbsp;` +

          ` </td>
          </tr>`;

      }

      //myBottonHtml = myBottonHtml + cardCash +


      let myHtml02Tag = `
      <div class="inv_details">
        <p style="text-align:left"><b> Invoice No.:` + invoiceNumber + `</b><br>  
        Date & Time:   &nbsp;` + this.todaydatashow + `<br>
        Customer: Walk-in  <br>
        Payment Method:` + payment.paymentMethod + `  </p>
        
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
            <td colspan="4" style="text-align: center;border-top: 1px solid #000;"><b>--- SALES RECEIPT ---</b>
            </td>
        </tr>    

        <tr>
        <th>Barcode</th>
        <th>Price</th>
        <th>Qty</th>
        ` ;

      // let taxItemTag = ``;
      // if (this.showTaxFlag) {
      //   taxItemTag = `<th >Tax</th>
      //   <th >GST%</th>`;
      // }

      myHtmlTableTag = myHtmlTableTag + //taxItemTag +

        `<th >Total</th>
        </tr>
        <tr >
            <th colspan="4" >Description</th>
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
                <td colspan="4" style="text-align: center;border-top: 1px solid #000;"><b>--- ` + saleReturnString + `---</b>
                </td>
            </tr>    

            <tr>
            <th>Barcode</th>
            <th>Price</th>
            <th>Qty</th>
            `;

      // taxItemTag = ``;
      // if (this.showTaxFlag) {
      //   taxItemTag = `<th >Tax</th>
      //       <th >GST%</th>`;
      // }

      myHtmlItemHeadingTag = myHtmlItemHeadingTag + //taxItemTag +


        ` <th >Total</th>
            </tr>
            <tr >
                <th colspan="4" >Description</th>
                <th></th>
            </tr>
          </thead>
          <tbody >
      `;


      let itemListHtmlTag = ``;
      let taxTdBlock = ``;
      let price: any = 0;

      for (let i = 0; i < cartDataList.product.length; i++) {
        price = (cartDataList.product[i].salePrice
          ? cartDataList.product[i].salePrice
          : cartDataList.product[i].unitPrice);


        if (cartDataList.product[i].quantity < 0) {
          //RETURNS
          returnCart.product.push(cartDataList.product[i]);
          returnCount += Number(cartDataList.product[i].quantity);

          //saleReturnString='RETURNS';
        }//if return items
        else {
          saleCount += Number(cartDataList.product[i].quantity);
          itemListHtmlTag = itemListHtmlTag +
            `<tr>
            <td>` +
            cartDataList.product[i].loginId + `-` + cartDataList.product[i].upc +
            `</td>
            <td>` +
            price.toFixed(2) +
            `</td>
            <td>` +
            cartDataList.product[i].quantity +
            `</td>`;
          // <td> 
          // (this.cartDataList.product[i].discount === null ? 0 : this.cartDataList.product[i].discount) +
          // `</td>`;

          saleBeforeTaxTotal += price;
          saleDiscountTotal += Number(cartDataList.product[i].discountVal);

          // if (this.showTaxFlag) {
          //   saleTaxTotal = saleTaxTotal + this.cartDataList.product[i].totalTax;
          //   taxTdBlock = `<td><b>` +
          //     (this.cartDataList.product[i].totalTax).toFixed(2) +
          //     `</b></td>
          //   <td><b>` +
          //     this.cartDataList.product[i].tax +
          //     `</b></td>`;

          // }
          // else {
          //   taxTdBlock = ``;
          // }

          saleTotal += Number(cartDataList.product[i].totalPrice);

          itemListHtmlTag += taxTdBlock +
            `<td><b>` +
            (Number(cartDataList.product[i].totalPrice)).toFixed(2) +
            `</b></td>
          </tr>
          <tr>
            <td colspan="4">` +
            cartDataList.product[i].productName +
            `</td>
             <td><td>
          </tr>
          `;

        }//else if SALE items


      } //for loop  

      itemListHtmlTag = itemListHtmlTag + `
      <tr>
            <td colspan="4" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>
      
      `;

      itemListHtmlTag = itemListHtmlTag + `
      <tr>
          <td colspan="4" style="border-top: 1pt solid black;"> &nbsp; </td>  
      </tr>
      <tr>
          <td colspan="1" > &nbsp;  </td> 
          <td><b>` + saleBeforeTaxTotal.toFixed(2) + `</b></td>
          <td><b>` + saleCount + `</b></td>`;

      // <td><b>` + saleDiscountTotal.toFixed(2) + `</b></td>`;
      let showTaxHTML = ``;
      // if (this.showTaxFlag) {
      //   showTaxHTML = `<td colspan="1">` + saleTaxTotal.toFixed(2) + ` </td>
      //   <td colspan="1"> &nbsp; </td>`;
      // }
      // else {
      //   showTaxHTML = `<td colspan="1"> &nbsp; </td>`;
      // }

      itemListHtmlTag = itemListHtmlTag + showTaxHTML +
        `
          <td><b>` + saleTotal.toFixed(2) + `</b></td>
        </tr>
    
      `;
      itemListHtmlTag = itemListHtmlTag + `
    <tr>
          <td colspan="4" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>
    
    `;

      /* **************** Check for any RETURNS ***************** */
      let returnHTMLTag = ``;
      if (returnCart.product.length > 0) {
        //Change heading to RETURNS
        saleReturnString = 'RETURNS';
        returnHTMLTag =
          `<tr class="inv_of">
                <td colspan="4" style="text-align: center;border-top: 1px solid #000;"><b>--- ` + saleReturnString + `---</b>
                </td>
         </tr>
          <tr>
          <td colspan="4" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>   `;

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
              <td colspan="4" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>
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
            <td colspan="4" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>
        
        `;
      }


      let tableFooterHtmlTag = `
      </tbody>
        <tfoot>
         <tr>
            <td colspan="4" style="text-align: left;border-top: 1px solid #000; font-weight: bold;">------- BILL SUMMARY --------</td>
         </tr>
        <tr>
        <td >Sub Total:</td>
        <td colspan="3" style="text-align: left;border-top: 1px solid #000;">` + this.currencySign + (this.priceSummary.total).toFixed(2) + ` </td>
        
        </tr>
        <tr>
        <td style="text-align: left;">Total Qty:</td>
        <td colspan="3" style="text-align: left;"> ` +
        this.priceSummary.totalQty +
        `</td>
        </tr>
        <tr>
        <td >Discount:</td>
        <td colspan="3" style="text-align: left;">` + this.currencySign + ((Number(this.priceSummary.discount))).toFixed(2); + ` </td>
        </tr> `

      let taxItemTRTag = ``;
      if (this.showTaxFlag) {
        taxItemTRTag = `<tr>
          <td >Tax:</td>
          <td colspan="3" style="text-align: left;">` + this.currencySign + (this.priceSummary.tax).toFixed(2) + ` </td>
          </tr>`;

      }
      tableFooterHtmlTag = tableFooterHtmlTag + taxItemTRTag +
        `<tr> 
          <td ><b>Total: </b></td>
          <td colspan="3" style="text-align: left;"><b>` + this.currencySign + (this.priceSummary.grandTotal) + `</b> </td>
         </tr>` + cardCash + `
         <tr>
           <td style="text-align: left;border-bottom: 1px solid #000;" ><b>Customer Balance: </b></td>
           <td colspan="3" style="text-align: left;border-bottom: 1px solid #000;"><b>` + this.currencySign + (customerBalance).toFixed(2) + `</b> </td>
         </tr>
         <tr>
           <td style="text-align: left;border-bottom: 1px solid #000;" ><b>Signature: </b></td>
           <td colspan="3" style="text-align: left;border-bottom: 1px solid #000;">___________________ </td>
         </tr>

        
            </tfoot>
        </table>
      
      `;

      //<img style="width:30mm;" src="assets/images/FBR_QRReceipt.png" >


      let fbrHtmlTag = environment.fbrHtmlTag;

      //<img style="width:6.5rem; height:6.5rem"  src='data:` + this.fbrQRCode.imageType + ` ;base64,` + this.fbrQRCode.image + `' alt="Card image cap">

      let contactHtmlTag = this.contact;



      let termHtmlTag = this.term;

      let lastHtmlTag = `
      <p style="margin-left:30px !important;">
          <b>Thanks for your purchase!</b>
      </p>
       
      </div>
           </div>
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
      //this.payment = new Payment();

      //////////////////////////////////
      //Code added for WhatsApp change
      //Dated: Sep 19, 2024
      this.printThermalHTMLTag = finalHTMLTag;



      ///////////////////////////////////////////////////////////////////////////
      //1st copy

      popupWin.document.write(finalHTMLTag);

      ///////////////////////////////////////////////////////////////////////////
      //2nd copy

      if (this.showTaxFlag) {
        finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + fbrHtmlTag + lastHtmlTag;
      }
      else {
        finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + lastHtmlTag;
      }
      finalHTMLTag = '<div class="page-break"></div> ' + finalHTMLTag;

      popupWin.document.write(finalHTMLTag);
      ///////////////////////////////////////////////////////////////////////////

      //  const phoneNumber = '+923213967330'; // Replace with the recipient's phone number including country code
      //  const message = encodeURIComponent(finalHTMLTag);
      //  const whatsappUrl = `https://web.whatsapp.com/${phoneNumber}?text=${message}`;

      //  window.location.href = whatsappUrl;


      popupWin.document.close();

      if (this.whatsappFlag) {
        //this.whatsAppMsg();


      }

      ////////////////////////////////



    }//popupWin

  }

  /* ********************************************* */

  printReturnSlipThermal(customer: Customer, payment: Payment, cartDataList: SalesAdjustmentItems[], customerBalance: number, invoiceNumber: any): void {
    let popupWin;

    let logo = environment.logoName;

    popupWin = window.open('', '_blank');
    let myFlag = true;
    if (popupWin != null || popupWin != undefined) {
      //if (myFlag){

      //popupWin = window.open('', '_blank');

      customer.firstName = 'POSCustomer';

      let orderAddress =
        customer?.address +
        ',' +
        customer?.city +
        ',' +
        customer?.stateProvince +
        ',' +
        customer?.postalCode;


      let mainImage = logo;


      let myHtml01Tag = `
      <html> 
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge"> `;


      //Get Style CSS
      let styleTag = this.getStyle();

      let appName = environment.appName;
      let companyTag = environment.companyName;

      let titleHtmlTag =
        `<title>  ` + appName + `  Receipt </title>
    </head>    
    <body  onload="window.print();window.close();">
    <div class="recipt_container">  
      <div class="header">
      <img class="img-fluid img-thumbnail" src="` + mainImage + `" >`;


      let companyInfoHtmlTag = ``;


      companyInfoHtmlTag = `	
        <div class="company_details">
          <p ><b> ` + appName + ` </b><br>
          </p>
          <br> ${companyTag}
        </div>
      `;
      let cardCash = '';
      if (payment.paymentMethod === 'CASH') {
        cardCash = `<tr>
          <td >Cash Paid:</td>
          <td colspan="5" style="text-align: left;"> ` + this.currencySign +
          (Number(this.result)).toFixed(2) +
          ` </td>
          </tr>`;

      }
      else if (payment.paymentMethod === 'CARD') {
        cardCash = `<tr>
          <td >Paid by Card</td>
          <td colspan="5" style="text-align: left;"> &nbsp;` +

          ` </td>
          </tr>`;

      }

      //myBottonHtml = myBottonHtml + cardCash +


      let myHtml02Tag = `
      <div class="inv_details">
        <p style="text-align:left"><b> Invoice No.:` + invoiceNumber + `</b><br>  
        Date & Time:   &nbsp;` + this.todaydatashow + `<br>
        Customer: Walk-in  <br>
        Payment Method:` + payment.paymentMethod + `  </p>
        
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
            <td colspan="4" style="text-align: center;border-top: 1px solid #000;"><b>--- RETURN RECEIPT ---</b>
            </td>
        </tr>    

        <tr>
        <th>Barcode</th>
        <th>Price</th>
        <th>Qty</th>
        ` ;

      // let taxItemTag = ``;
      // if (this.showTaxFlag) {
      //   taxItemTag = `<th >Tax</th>
      //   <th >GST%</th>`;
      // }

      myHtmlTableTag = myHtmlTableTag + //taxItemTag +

        `<th >Total</th>
        </tr>
        <tr >
            <th colspan="4" >Description</th>
            <th></th>
        </tr>
      </thead>
      <tbody >
      
      `;

      let saleReturnString = 'RETURNS';
      let myHtmlItemHeadingTag = `
          <table >
       
          <thead>
            <tr class="inv_of">
                <td colspan="4" style="text-align: center;border-top: 1px solid #000;"><b>--- ` + saleReturnString + `---</b>
                </td>
            </tr>    

            <tr>
            <th>Barcode</th>
            <th>Price</th>
            <th>Qty</th>
            `;


      myHtmlItemHeadingTag = myHtmlItemHeadingTag + //taxItemTag +


        ` <th >Total</th>
            </tr>
            <tr >
                <th colspan="4" >Description</th>
                <th></th>
            </tr>
          </thead>
          <tbody >
      `;


      let itemListHtmlTag = ``;
      let taxTdBlock = ``;
      let price: any = 0;

      for (let i = 0; i < cartDataList.length; i++) {
        price = cartDataList[i].unitPrice;



        saleCount += Number(cartDataList[i].qty);
        itemListHtmlTag = itemListHtmlTag +
          `<tr>
            <td>` +
          cartDataList[i].upc +
          `</td>
            <td>` +
          price.toFixed(2) +
          `</td>
            <td>` +
          cartDataList[i].qty +
          `</td>`;

        saleBeforeTaxTotal += price;
        //saleDiscountTotal += Number(cartDataList.product[i].discountVal);


        saleTotal += Number(cartDataList[i].totalAmount);

        itemListHtmlTag += taxTdBlock +
          `<td><b>` +
          (Number(cartDataList[i].totalAmount)).toFixed(2) +
          `</b></td>
          </tr>
          <tr>
            <td colspan="4">` +
          cartDataList[i].productName +
          `</td>
             <td><td>
          </tr>
          `;




      } //for loop  

      itemListHtmlTag = itemListHtmlTag + `
      <tr>
            <td colspan="4" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>
      
      `;

      itemListHtmlTag = itemListHtmlTag + `
      <tr>
          <td colspan="4" style="border-top: 1pt solid black;"> &nbsp; </td>  
      </tr>
      <tr>
          <td colspan="1" > &nbsp;  </td> 
          <td><b>` + saleBeforeTaxTotal.toFixed(2) + `</b></td>
          <td><b>` + saleCount + `</b></td>`;

      // <td><b>` + saleDiscountTotal.toFixed(2) + `</b></td>`;
      let showTaxHTML = ``;
      // if (this.showTaxFlag) {
      //   showTaxHTML = `<td colspan="1">` + saleTaxTotal.toFixed(2) + ` </td>
      //   <td colspan="1"> &nbsp; </td>`;
      // }
      // else {
      //   showTaxHTML = `<td colspan="1"> &nbsp; </td>`;
      // }

      itemListHtmlTag = itemListHtmlTag + showTaxHTML +
        `
          <td><b>` + saleTotal.toFixed(2) + `</b></td>
        </tr>
    
      `;
      itemListHtmlTag = itemListHtmlTag + `
    <tr>
          <td colspan="4" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>
    
    `;

      /* **************** Check for any RETURNS ***************** */
      let returnHTMLTag = ``;
      // if (returnCart.product.length > 0) {
      //   //Change heading to RETURNS
      //   saleReturnString = 'RETURNS';
      //   returnHTMLTag =
      //     `<tr class="inv_of">
      //           <td colspan="4" style="text-align: center;border-top: 1px solid #000;"><b>--- ` + saleReturnString + `---</b>
      //           </td>
      //    </tr>
      //     <tr>
      //     <td colspan="4" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>   `;

      //   itemListHtmlTag = itemListHtmlTag + returnHTMLTag;

      //   for (let i = 0; i < returnCart.product.length; i++) {
      //     itemListHtmlTag = itemListHtmlTag +
      //       `<tr>
      //       <td>` +
      //       returnCart.product[i].loginId + `-` + returnCart.product[i].upc +
      //       `</td>
      //       <td>` +
      //       price.toFixed(2) +
      //       `</td>
      //       <td>` +
      //       returnCart.product[i].quantity +
      //       `</td>
      //       <td>` +
      //       (returnCart.product[i].discount === null ? 0 : returnCart.product[i].discount) +
      //       `</td>`;
      //     returnBeforeTaxTotal += price;
      //     returnDiscountTotal += Number(returnCart.product[i].discountVal);


      //     if (this.showTaxFlag) {
      //       returnTaxTotal += returnCart.product[i].totalTax;
      //       taxTdBlock = `<td><b>` +
      //         (returnCart.product[i].totalTax).toFixed(2) +
      //         `</b></td>
      //       <td><b>` +
      //         returnCart.product[i].tax +
      //         `</b></td>`;

      //     }
      //     else {
      //       taxTdBlock = ``;
      //     }

      //     returnTotal += Number(returnCart.product[i].totalPrice);
      //     itemListHtmlTag += taxTdBlock +
      //       `<td><b>` +
      //       (Number(returnCart.product[i].totalPrice)).toFixed(2) +
      //       `</b></td>
      //     </tr>
      //     <tr>
      //       <td colspan="7">` +
      //       returnCart.product[i].productName +
      //       `</td>
      //        <td><td>
      //     </tr>
      //     `;

      //   }//for loop RETURNS

      // }

      /* *************** LOOP for Items ENDS ********************* */
      //Make return count +ve and return Total +ve

      // if (returnCart.product.length > 0) {
      //   returnCount = returnCount * -1;
      //   //returnTotal = returnTotal * -1;

      //   itemListHtmlTag = itemListHtmlTag + `
      //     <tr>
      //         <td colspan="4" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>
      //     </tr>
      //     <tr>
      //         <td colspan="1" > &nbsp;  </td> 
      //         <td><b>` + returnBeforeTaxTotal.toFixed(2) + `</b></td>
      //         <td><b>` + returnCount + `</b></td>
      //         <td><b>` + returnDiscountTotal.toFixed(2) + `</b></td>`;

      //   showTaxHTML = ``;
      //   if (this.showTaxFlag) {
      //     showTaxHTML = `<td colspan="1">` + returnTaxTotal.toFixed(2) + ` </td>
      //     <td colspan="1"> &nbsp; </td>`;
      //   }
      //   else {
      //     showTaxHTML = `<td colspan="1"> &nbsp; </td>`;
      //   }
      //   itemListHtmlTag = itemListHtmlTag + showTaxHTML + `
              
      //         <td><b>` + returnTotal.toFixed(2) + `</b></td>
      //     </tr>
        
      //   `;
      //   itemListHtmlTag = itemListHtmlTag + `
      //   <tr>
      //       <td colspan="4" style="border-top: 1pt solid black;"> &nbsp; </td> </tr>
        
      //   `;
      // }


      let tableFooterHtmlTag = `
      </tbody>
        <tfoot>
         <tr>
            <td colspan="4" style="text-align: left;border-top: 1px solid #000; font-weight: bold;">------- BILL SUMMARY --------</td>
         </tr>
        <tr>
        <td >Sub Total:</td>
        <td colspan="3" style="text-align: left;border-top: 1px solid #000;">` + this.currencySign + (this.priceSummary.total).toFixed(2) + ` </td>
        
        </tr>
        <tr>
        <td style="text-align: left;">Total Qty:</td>
        <td colspan="3" style="text-align: left;"> ` +
        this.priceSummary.totalQty +
        `</td>
        </tr>
        <tr>
        <td >Discount:</td>
        <td colspan="3" style="text-align: left;">` + this.currencySign + ((Number(this.priceSummary.discount))).toFixed(2); + ` </td>
        </tr> `

      let taxItemTRTag = ``;
      if (this.showTaxFlag) {
        taxItemTRTag = `<tr>
          <td >Tax:</td>
          <td colspan="3" style="text-align: left;">` + this.currencySign + (this.priceSummary.tax).toFixed(2) + ` </td>
          </tr>`;

      }
      tableFooterHtmlTag = tableFooterHtmlTag + taxItemTRTag +
        `<tr> 
          <td ><b>Total: </b></td>
          <td colspan="3" style="text-align: left;"><b>` + this.currencySign + (this.priceSummary.grandTotal) + `</b> </td>
         </tr>` + cardCash + `
         <tr>
           <td style="text-align: left;border-bottom: 1px solid #000;" ><b>Customer Balance: </b></td>
           <td colspan="3" style="text-align: left;border-bottom: 1px solid #000;"><b>` + this.currencySign + (customerBalance).toFixed(2) + `</b> </td>
         </tr>
         <tr>
           <td style="text-align: left;border-bottom: 1px solid #000;" ><b>Signature: </b></td>
           <td colspan="3" style="text-align: left;border-bottom: 1px solid #000;">___________________ </td>
         </tr>

        
            </tfoot>
        </table>
      
      `;

      //<img style="width:30mm;" src="assets/images/FBR_QRReceipt.png" >


      let fbrHtmlTag = environment.fbrHtmlTag;

      //<img style="width:6.5rem; height:6.5rem"  src='data:` + this.fbrQRCode.imageType + ` ;base64,` + this.fbrQRCode.image + `' alt="Card image cap">

      let contactHtmlTag = this.contact;



      let termHtmlTag = this.term;

      let lastHtmlTag = `
      <p style="margin-left:30px !important;">
          <b>Thanks for your purchase!</b>
      </p>
       
      </div>
           </div>
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
      //this.payment = new Payment();

      //////////////////////////////////
      //Code added for WhatsApp change
      //Dated: Sep 19, 2024
      this.printThermalHTMLTag = finalHTMLTag;



      ///////////////////////////////////////////////////////////////////////////
      //1st copy

      popupWin.document.write(finalHTMLTag);

      ///////////////////////////////////////////////////////////////////////////
      //2nd copy

      if (this.showTaxFlag) {
        finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + fbrHtmlTag + lastHtmlTag;
      }
      else {
        finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + lastHtmlTag;
      }
      finalHTMLTag = '<div class="page-break"></div> ' + finalHTMLTag;

      popupWin.document.write(finalHTMLTag);
      ///////////////////////////////////////////////////////////////////////////

      //  const phoneNumber = '+923213967330'; // Replace with the recipient's phone number including country code
      //  const message = encodeURIComponent(finalHTMLTag);
      //  const whatsappUrl = `https://web.whatsapp.com/${phoneNumber}?text=${message}`;

      //  window.location.href = whatsappUrl;


      popupWin.document.close();

      if (this.whatsappFlag) {
        //this.whatsAppMsg();


      }

      ////////////////////////////////



    }//popupWin

  }


  /* *********************************************************** */

  getStyle(): string {

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


 .img-fluid {
            max-width: 100%;
            height: auto;
        }

        .img-thumbnail {
            padding: 0.25rem;
            background-color: #fff;
            border: 1px solid #dee2e6;
            border-radius: 0.25rem;
            max-width: 3rem;
            height: 3rem;
        }
.pos-logo {
  max-height: 60px;
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
      .termCondition{
            font-size:7px;
        }
    </style>`;


    return styleTag;
  }

}
