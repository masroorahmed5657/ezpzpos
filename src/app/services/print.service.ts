import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Customer, CartHold, Payment, PriceSummary, Product, OrderSaleDailyReport, OrderSaleReportResponse, OrderSaleReport, CategorySaleResponse, CategorySalePrice } from '../model/model-classes.model';
import { ProductView, SalesAdjustmentItems } from '../data-type';
import { ReportsService } from './reports.service';
import { formatDate } from '@angular/common';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PrintService {

  //  customer: Customer = new Customer();
  private appName = environment.appName;
  private showAgent = environment.showAgentFlag;
  private posCustomerNameFlag = environment.posCustomerNameFlag;
  private posCustomerPhoneFlag = environment.posCustomerPhoneFlag;
  private currencySign = environment.currency;
  private showTaxFlag: boolean = true;
  private whatsappFlag: boolean = false;

  //payment: Payment = new Payment();
  result: any = '';
  // invoiceNumber: any = 'BL00012';
  //todaydatashow: any = '';
  todaydatashow = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en-US');
  //cartDataList: CartHold = new CartHold();
  printThermalHTMLTag = '';
  // customerBalance: number = 0;
  term = environment.termHtmlTag;
  private contact = environment.contactHtmlTag;
  // billCopyNumber = environment.billCopyNumber;


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



  constructor(private reportsService: ReportsService) { }


  /* ********************************************* */

  printThermalRestaurant(customer: Customer, payment: Payment, cartDataList: any,
    customerBalance: number,
    invoiceNumber: any, printTokenFlag: any,
    todaydatashow: any, orderNotes: any,
    dineInFlag: boolean,
    billCopyNumber: any): void {

    //let popupWin;
    let popupWin: Window | null;

    let logo = environment.logoName;

    popupWin = window.open('', '_blank');

    //if (popupWin != null || popupWin != undefined) {
    if (!popupWin) {
      alert('Popup blocked');
      return;
    }

    todaydatashow = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en-US');

    let myFlag = true;
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


    //if (myFlag){
    {
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

      //<body  onload="window.print();window.close();">

      let titleHtmlTag =
        `<title>  ` + appName + `  Receipt </title>
    </head>  
    <script>
          function handlePrint() {
              window.print();

              window.onafterprint = function() {
              window.close(); // closes AFTER print dialog
            };
          }
      </script>    
        <body  onload="window.print()" onafterprint="window.close()">  
    
    <div class="receipt_container">  
      <div class="header">
      <img  src="` + mainImage + `"  class="img-fluid"  style="height:120px; width:auto;"  alt="Logo">`;
      titleHtmlTag = titleHtmlTag + `<p style="text-align:center; font-size: 14pt; color:red;"><b>--- ORIGINAL ---</b></p>`;

      //  <img class="img-fluid img-thumbnail" src="` + mainImage + `" >`;


      let companyInfoHtmlTag = ``;

      //<p ><b> ` + appName + ` </b><br>     </p>

      //      if (this.showTaxFlag) {
      companyInfoHtmlTag = `	
        <div class="company_details">
          
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

      if (payment.paymentMethod === undefined) {
        payment.paymentMethod = 'CASH';
      }

      let cardCash = '';
      if (payment.paymentMethod === 'CASH') {

        if (payment.customerPaid === undefined) {
          cardCash = `<tr>
            
            <td colspan="2" style="text-align: right;">Cash Paid:</td>
            <td colspan="2" style="text-align: right;"> ` + this.currencySign +
            0.00 +
            ` </td>
            </tr>`;

        }
        else {
          cardCash = `<tr>
            
            <td colspan="2" style="text-align: right;">Cash Paid:</td>
            <td colspan="2" style="text-align: right;"> ` + this.currencySign +
            (Number(payment.customerPaid)).toFixed(2) +
            ` </td>
            </tr>`;

        }

      }
      else if (payment.paymentMethod === 'CARD') {
        cardCash = `<tr>
        
          <td colspan="2"  style="text-align: right;">Paid by Card</td>
          <td colspan="2"  style="text-align: right;"> &nbsp;` +

          ` </td>
          </tr>`;

      }

      //myBottonHtml = myBottonHtml + cardCash +

      let customerName = '';
      let customerPhone = '';
      if (customer.custName === 'pos') {
        customerName = 'Walk In';
      }
      else {
        customerName = customer.custName!;
        if (this.posCustomerPhoneFlag) {
          customerPhone = customer.phone1!;
        }
        else {
          customerPhone = '';
        }

      }

      if (customerName === undefined) {
        customerName = 'Walk-In';
      }

      let myHtml02Tag = `
      <div class="inv_details">
        <p style="font-size: 8pt;text-align:left; line-height:1rem"><b> Invoice No.:` + invoiceNumber + `</b><br>  
        Date & Time:   &nbsp;` + todaydatashow + `<br>
        Customer: ${customerName} / ${customerPhone} <br>
        Payment Method:` + payment.paymentMethod + `  </p>
        
      </div>  
      <div class="items">
      
      `;




      let myHtmlTableTag = `
      <table style="font-size:10pt;margin-top:1rem;table-layout: fixed;width: 100%; word-wrap: break-word;" >
       
      <thead>
        <tr class="inv_of">
            <td colspan="4" style="text-align: center;"><b>--- SALES RECEIPT ---</b>
            </td>
        </tr>    

        <tr>
        <th>Desc</th>
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
      </thead>
      <tbody >
      
      `;

      let saleReturnString = 'SALES';
      let myHtmlItemHeadingTag = `
          <table style="font-size:10pt;margin-top:1rem;table-layout: fixed;width: 100%; word-wrap: break-word;">
       
          <thead>
            <tr class="inv_of">
                <td colspan="4" style="text-align: center;"><b>--- ` + saleReturnString + `---</b>
                </td>
            </tr>    

            <tr>
            <th>Desc</th>
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
          </thead>
          <tbody >
      `;


      let itemListHtmlTag = ``;
      let taxTdBlock = ``;
      let price: any = 0;

      /////////////////////////////////
      //For DIN-IN cart has items array
      /////////////////////////////////
      if (dineInFlag) {
        cartDataList.items.forEach((item: any) => {
          item.productName

          if (item.quantity < 0) {
            //RETURNS
            returnCart.product.push(item);
            returnCount += Number(item.quantity);

            //saleReturnString='RETURNS';
          }//if return items
          else {
            saleCount += Number(item.quantity);
            itemListHtmlTag = itemListHtmlTag +
              `<tr>
            <td>` +
              item.productName +
              `</td>
            <td>` +
              item.totalPrice +
              `</td>
            <td>` +
              item.quantity +
              `</td>`;

            saleBeforeTaxTotal += price;
            //saleDiscountTotal += Number(cartDataList.product[i].discountVal);

            saleTotal += Number(item.totalPrice);

            itemListHtmlTag += taxTdBlock +
              `<td><b>` +
              (Number(item.totalPrice)).toFixed(2) +
              `</b></td>
          </tr>
          `;

          }//else if SALE items




        });

      }//dine-in flag
      ///////////////////////////////////
      // PICKUP CART has products
      //////////////////////////////////
      else {
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
              cartDataList.product[i].productName +
              `</td>
            <td>` +
              price.toFixed(2) +
              `</td>
            <td>` +
              cartDataList.product[i].quantity +
              `</td>`;

            saleBeforeTaxTotal += price;
            saleDiscountTotal += Number(cartDataList.product[i].discountVal);

            saleTotal += Number(cartDataList.product[i].totalPrice);

            itemListHtmlTag += taxTdBlock +
              `<td><b>` +
              (Number(cartDataList.product[i].totalPrice)).toFixed(2) +
              `</b></td>
          </tr>
          `;

          }//else if SALE items


        } //for loop  

      }//PICKUP/DELIVERY


      itemListHtmlTag = itemListHtmlTag + `
      <tr>
            <td colspan="4" > &nbsp; </td> 
      </tr>
      
      `;

      itemListHtmlTag = itemListHtmlTag + `
      <tr>
          <td colspan="4" > &nbsp; </td>  
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
          <td colspan="4" > &nbsp; </td> </tr>
    
    `;


      if (payment.discount === undefined) {
        payment.discount = 0;
      }

      if (payment.taxesAmount === undefined) {
        payment.taxesAmount = 0;
      }
      if (payment.totalAmount === undefined) {
        payment.totalAmount = 0;
      }

      if (customerBalance === undefined) {
        customerBalance = 0;
      }

      let tableFooterHtmlTag = `
      </tbody>
        <tfoot>
        `;

      let notesHtml = ``;
      if (orderNotes !== null) {
        notesHtml = `
        <tr>
          <td colspan="4" style="text-align: left;">
            Special Instructions: ` + (orderNotes ?? '') + `
          </td>
        </tr>`;

      }

      //let discountValue = Number(payment.discount); //* saleTotal)/100;

      let footHtml = ``;

      if (dineInFlag) {
        footHtml = tableFooterHtmlTag + notesHtml +
          `
         <tr>
            <td colspan="4" style="text-align: right; font-weight: bold;">
            <p style="margin-bottom:1rem;display: table-row-group; ">------- BILL SUMMARY --------</p>
            </td>
         </tr>
        <tr>
        
        <td colspan="2"  style="text-align: right;">Sub Total:</td>
        <td colspan="2"  style="text-align: right;">` + this.currencySign + ` ` + (saleTotal).toFixed(2) + ` </td>
        
        </tr>
        <tr>
        
        <td colspan="2" style="text-align: right;">Total Qty:</td>
        <td colspan="2" style="text-align: right;"> ` + saleCount + `</td>
        </tr>
        
        <tr >
      
        <td colspan="2" style="text-align: right;">Discount% (${cartDataList.priceSummary.discountPercentage | 0}):</td>
        <td colspan="2" style="text-align: right;">` + this.currencySign + ` ` + (cartDataList.priceSummary.discount).toFixed(2); + ` </td>
        </tr> `

      }//DINE-IN FLAG
      else {
        footHtml = tableFooterHtmlTag + notesHtml +
          `
         <tr>
            <td colspan="4" style="text-align: right; font-weight: bold;">
            <p style="margin-bottom:1rem;display: table-row-group; ">------- BILL SUMMARY --------</p>
            </td>
         </tr>
        <tr>
        
        <td colspan="2"  style="text-align: right;">Sub Total:</td>
        <td colspan="2"  style="text-align: right;">` + this.currencySign + ` ` + (saleTotal).toFixed(2) + ` </td>
        
        </tr>
        <tr>
        
        <td colspan="2" style="text-align: right;">Total Qty:</td>
        <td colspan="2" style="text-align: right;"> ` + saleCount + `</td>
        </tr>
        
        <tr >
      
        <td colspan="2" style="text-align: right;">Discount% (${cartDataList.discountPercentage | 0}):</td>
        <td colspan="2" style="text-align: right;">` + this.currencySign + ` ` + (cartDataList.discount).toFixed(2); + ` </td>
        </tr> `



      }//PICKUP/DELIVERY


      let taxItemTRTag = ``;

      if (this.showTaxFlag) {

        if (dineInFlag) {
          taxItemTRTag = `
          <tr>
            <td colspan="2" style="text-align: right;">Tax% (${cartDataList.priceSummary.taxesPercentage | 0}):</td>
            <td colspan="2" style="text-align: right;">` + this.currencySign + ` ` + (cartDataList.priceSummary.tax).toFixed(2) + ` </td>
          </tr>`;

        }
        else {
          taxItemTRTag = `
        <tr>
          
          <td colspan="2" style="text-align: right;">Tax% (${cartDataList.taxesPercentage | 0}):</td>
          <td colspan="2" style="text-align: right;">` + this.currencySign + ` ` + (payment.taxesAmount).toFixed(2) + ` </td>
          </tr>`;


        }

      }

      let total = 0;
      if (dineInFlag) {
        total = cartDataList.priceSummary.grandTotal;
      }
      else {
        total = saleTotal - Number(cartDataList.discount) + payment.taxesAmount;
      }


      //tableFooterHtmlTag +
      tableFooterHtmlTag = footHtml + taxItemTRTag +
        `<tr> 
          
          <td colspan="2"  style="text-align: right;"><b>Total: </b></td>
          <td colspan="2"  style="text-align: right;"><b>` + this.currencySign + ` ` + (total).toFixed(2) + `</b> </td>
         </tr>` + cardCash + `
         <tr>
          
           <td colspan="2"  style="text-align: right;"><b>Customer Balance: </b></td>
           <td colspan="2" style="text-align: right;"><b>` + this.currencySign + ` ` + (customerBalance).toFixed(2) + `</b> </td>
         </tr>
         <tr>
           <td colspan="2" style="text-align: right;line-height:1rem;" ><b>Signature </b></td>
           <td colspan="2" style="text-align: right;">___________________ </td>
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
      <p >
          <b>Thanks for your purchase!</b>
      </p>
       
      </div>
           </div>
    </div>


      </body>
    </html>
      `;
      //<button class="btn btn-success" onclick="window.close()">Close</button>

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
      //console.log(finalHTMLTag)
      let copyNumberText = '';

      ///////////////////////////////////////////////////////////////////////////
      for (let billRow = 1; billRow < billCopyNumber; billRow++) {
        //if (billRow === 1) {
        //2nd copy
            // titleHtmlTag = titleHtmlTag + `<p style="text-align:center; font-size: 10pt; color:red;"><b>--- ORIGINAL ---</b></p>`;
        //}


        if (billCopyNumber >= 2) {
        //2nd copy
        //replace ORIGINAL with COPY
        titleHtmlTag = titleHtmlTag.replace('--- ORIGINAL ---', '--- COPY ---');
            //titleHtmlTag = titleHtmlTag + `<p style="text-align:center; font-size: 10pt; color:red;"><b>--- COPY ---</b></p>`;
        }

        if (this.showTaxFlag) {
          finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + fbrHtmlTag + lastHtmlTag;
        }
        else {
          finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + lastHtmlTag;
        }
        finalHTMLTag = '<div class="page-break"></div> ' + finalHTMLTag;

        popupWin.document.write(finalHTMLTag);

        //console.log('SECOND: '+finalHTMLTag)
      }

      ///////////////////////////////////////////////////////////////////////////

      //  const phoneNumber = '+923213967330'; // Replace with the recipient's phone number including country code
      //  const message = encodeURIComponent(finalHTMLTag);
      //  const whatsappUrl = `https://web.whatsapp.com/${phoneNumber}?text=${message}`;

      //  window.location.href = whatsappUrl;


      // if (printTokenFlag) {

      //   let tokenHtml = this.printCounterToken(cartDataList, invoiceNumber, todaydatashow, popupWin, dineInFlag, customerName);
      //   //popupWin.document.write(tokenHtml);
      // }


      popupWin.document.close();

      // // Wait for content to load, then print
      // popupWin.onload = function () {
      //   popupWin!.focus();
      //   popupWin!.print();

      //   // optional: close after print
      //   setTimeout(() => {
      //     popupWin!.close();
      //   }, 500);
      // };

      if (this.whatsappFlag) {
        //this.whatsAppMsg();


      }

      ////////////////////////////////



    }//popupWin

  }


  /* ********************************************* */

  printThermal(customer: Customer,
    payment: Payment,
    cartDataList: CartHold,
    customerBalance: number,
    invoiceNumber: any,
    billCopyNumber: any): void {
    //let popupWin;
    let popupWin: Window | null;


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
     <script>
          function handlePrint() {
              window.print();

              window.onafterprint = function() {
              window.close(); // closes AFTER print dialog
            };
          }
      </script>    
        <body  onload="window.print()" onafterprint="window.close()">  
    
    <div class="recipt_container">  
      <div class="header">
      <img class="img-fluid img-thumbnail" src="` + mainImage + `" >`;


      let companyInfoHtmlTag = ``;

      //      if (this.showTaxFlag) {
      companyInfoHtmlTag = `	
        <div class="company_details">
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
          <td colspan="2" style="text-align: right;">Cash Paid:</td>
          <td colspan="2" style="text-align: right;"> ` + this.currencySign +
          (Number(payment.customerPaid)).toFixed(2) +
          ` </td>
          </tr>`;

      }
      else if (payment.paymentMethod === 'CARD') {
        cardCash = `<tr>
          <td colspan="2" style="text-align: right;">Paid by Card</td>
          <td colspan="2" style="text-align: right;"> &nbsp;` +

          ` </td>
          </tr>`;

      }

      //myBottonHtml = myBottonHtml + cardCash +


      let myHtml02Tag = `
      <div class="inv_details">
        <p style="font-size: 8pt;text-align:left"><b> Invoice No.:` + invoiceNumber + `</b><br>  
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
      <table style="font-size:10pt;margin-top:1rem;table-layout: fixed;width: 95%; word-wrap: break-word;">
       
      <thead>
        <tr class="inv_of">
            <td colspan="4" style="text-align: center;"><b>--- SALES RECEIPT ---</b>
            </td>
        </tr>    

        <tr>
        <th>Desc</th>
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
      </thead>
      <tbody >
      
      `;

      let saleReturnString = 'SALES';
      let myHtmlItemHeadingTag = `
          <table style="font-size:10pt;margin-top:1rem;table-layout: fixed;width: 95%; word-wrap: break-word;">
       
          <thead>
            <tr class="inv_of">
                <td colspan="4" style="text-align: center;"><b>--- ` + saleReturnString + `---</b>
                </td>
            </tr>    

            <tr>
            <th>Desc</th>
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
            <td colspan="4" > &nbsp; </td> 
      </tr>
      
      `;

      itemListHtmlTag = itemListHtmlTag + `
      <tr>
          <td colspan="4" > &nbsp; </td>  
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
          <td colspan="4" > &nbsp; </td> </tr>
    
    `;

      /* **************** Check for any RETURNS ***************** */
      let returnHTMLTag = ``;
      if (returnCart.product.length > 0) {
        //Change heading to RETURNS
        saleReturnString = 'RETURNS';
        returnHTMLTag =
          `<tr class="inv_of">
                <td colspan="4" style="text-align: center;"><b>--- ` + saleReturnString + `---</b>
                </td>
         </tr>
             `;

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
        
        
        `;
      }


      let tableFooterHtmlTag = `
      </tbody>
        <tfoot>
         <tr>
            <td colspan="4" style="text-align: right; font-weight: bold;">
            <p style="margin-bottom:1rem;display: table-row-group; ">------- BILL SUMMARY --------</p>
            </td>
         </tr>

        <tr>
        
        <td colspan="2"  style="text-align: right;">Sub Total:</td>
        <td colspan="2"  style="text-align: right;">` + this.currencySign + (saleTotal).toFixed(2) + ` </td>
        
        </tr>
        <tr>
        <td colspan="2" style="text-align: right;">Total Qty:</td>
        <td colspan="2" style="text-align: right;"> ` +
        saleCount +
        `</td>
        </tr>
        <tr>
        <td colspan="2" style="text-align: right;">Discount% (${cartDataList.discountPercentage | 0}):</td>
        <td colspan="2" style="text-align: right;">` + this.currencySign + (payment.discount).toFixed(2); + ` </td>
        </tr> `

      /*
            this.payment.discount = this.priceSummary.discount;
            this.payment.taxesAmount = this.priceSummary.tax;
      
      */

      let taxItemTRTag = ``;
      if (this.showTaxFlag) {
        taxItemTRTag = `<tr>
          <td colspan="2" style="text-align: right;">Tax% (${cartDataList.taxesPercentage | 0}):</td>
          <td colspan="2" style="text-align: right;">` + this.currencySign + (payment.taxesAmount).toFixed(2) + ` </td>
          </tr>`;

      }
      let total = 0;
      total = saleTotal - Number(cartDataList.discount) + payment.taxesAmount;

      tableFooterHtmlTag = tableFooterHtmlTag + taxItemTRTag +
        `<tr> 
          
          <td colspan="2" style="text-align: right;"><b>Total: </b></td>
          <td colspan="2" style="text-align: right;"><b>` + this.currencySign + (total) + `</b> </td>
         </tr>`
        + cardCash + `
         <tr>
           
           <td colspan="2"  style="text-align: right;" ><b>Customer Balance: </b></td>
           <td colspan="2"  style="text-align: right;"><b>` + this.currencySign + (customerBalance).toFixed(2) + `</b> </td>
         </tr>
         <tr>
           <td colspan="2"  style="text-align: right;" ><b>Signature: </b></td>
           <td colspan="2"  style="text-align: right;">___________________ </td>
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
      ///////////////////////////////////////////////////////////////////////////
      for (let billRow = 1; billRow < billCopyNumber; billRow++) {
        // if (billCopyNumber === 2) {
        //2nd copy

        if (this.showTaxFlag) {
          finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + fbrHtmlTag + lastHtmlTag;
        }
        else {
          finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + lastHtmlTag;
        }
        finalHTMLTag = '<div class="page-break"></div> ' + finalHTMLTag;

        popupWin.document.write(finalHTMLTag);

        //console.log('SECOND: '+finalHTMLTag)
      }



      // //2nd copy

      // if (this.showTaxFlag) {
      //   finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + fbrHtmlTag + lastHtmlTag;
      // }
      // else {
      //   finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + companyInfoHtmlTag + myHtml02Tag + myHtmlItemHeadingTag + itemListHtmlTag + tableFooterHtmlTag + lastHtmlTag;
      // }
      // finalHTMLTag = '<div class="page-break"></div> ' + finalHTMLTag;

      // popupWin.document.write(finalHTMLTag);
      ///////////////////////////////////////////////////////////////////////////

      //  const phoneNumber = '+923213967330'; // Replace with the recipient's phone number including country code
      //  const message = encodeURIComponent(finalHTMLTag);
      //  const whatsappUrl = `https://web.whatsapp.com/${phoneNumber}?text=${message}`;

      //  window.location.href = whatsappUrl;


      popupWin.document.close();
      // Wait for content to load, then print
      // popupWin.onload = function () {
      //   popupWin!.focus();
      //   popupWin!.print();

      //   // optional: close after print
      //   setTimeout(() => {
      //     popupWin!.close();
      //   }, 500);
      // };

      if (this.whatsappFlag) {
        //this.whatsAppMsg();


      }

      ////////////////////////////////



    }//popupWin

  }

  /* ********************************************* */

  printReturnSlipThermal(customer: Customer, payment: Payment, cartDataList: SalesAdjustmentItems[], customerBalance: number, invoiceNumber: any): void {
    //let popupWin;
    let popupWin: Window | null;


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
     <script>
          function handlePrint() {
              window.print();

              window.onafterprint = function() {
              window.close(); // closes AFTER print dialog
            };
          }
      </script>    
        <body  onload="handlePrint();">  

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
            <th colspan="4" >Desc</th>
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
                <th colspan="4" >Desc</th>
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
        <td colspan="3" style="text-align: left;border-top: 1px solid #000;">` + this.currencySign + (saleTotal).toFixed(2) + ` </td>
        
        </tr>
        <tr>
        <td style="text-align: left;">Total Qty:</td>
        <td colspan="3" style="text-align: left;"> ` +
        saleCount +
        `</td>
        </tr>
        <tr>
        <td >Discount% (${cartDataList[0].discountPercentage | 0}):</td>
        <td colspan="3" style="text-align: left;">` + this.currencySign + ((Number(cartDataList[0].discount))).toFixed(2); + ` </td>
        </tr> `

      let taxItemTRTag = ``;
      if (this.showTaxFlag) {
        taxItemTRTag = `<tr>
          <td >Tax% (${cartDataList[0].taxesPercentage | 0}):</td>
          <td colspan="3" style="text-align: left;">` + this.currencySign + (payment.taxesAmount).toFixed(2) + ` </td>
          </tr>`;

      }
      let total = 0;
      total = saleTotal - Number(cartDataList[0].discount) + payment.taxesAmount;

      tableFooterHtmlTag = tableFooterHtmlTag + taxItemTRTag +
        `<tr> 
          <td ><b>Total: </b></td>
          <td colspan="3" style="text-align: left;"><b>` + this.currencySign + (total) + `</b> </td>
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
      // Wait for content to load, then print
      // popupWin.onload = function () {
      //   popupWin!.focus();
      //   popupWin!.print();

      //   // optional: close after print
      //   setTimeout(() => {
      //     popupWin!.close();
      //   }, 500);
      // };

      if (this.whatsappFlag) {
        //this.whatsAppMsg();


      }

      ////////////////////////////////



    }//popupWin

  }

  /* ********************************************* */
  //Category#1
  getCategoryGroupHtml(category: any, tokenNumber: any, todaydatashow: any, counterName: any, customerName: any) {
    let finalHtml = ``;

    let pageBreakHtml = `<div class="page-break"></div>`;

    let logo = environment.logoName;

    let titleHtml = `
      <div class="category">
      <img class="img-fluid img-thumbnail" src="` + logo + `" >
        <p style="text-align:left"><b> Token No.:` + tokenNumber + `</b><br>  
        Date & Time:   &nbsp;` + todaydatashow + `<br>
        Customer: ${customerName}   <br>
        </p>
        
      </div>  
      <div class="">
      `;

    let lastHtmlTag = `
  
      </div>
      `;



    let content = `
    <h3>${counterName} Token</h3>
    <table class="table table-bordered table-hover align-middle text-center" style="width: 80%;">
    <tr>
    <th style="text-align: left;border-bottom: 2px solid black;">Item </th> 
    <th style="text-align: left;border-bottom: 2px solid black;"> Price</th> 
    <th style="text-align: left;border-bottom: 2px solid black;"> Qty </th> 
    <th style="text-align: left;border-bottom: 2px solid black;"> Total</th>
    </tr>
    
    `;

    //<td style="font-weight: bold;width:20%">${item.price}/- </td>
    // <td style="font-weight: bold;width:20%"> ${item.quantity}</td> 
    // <td style="font-weight: bold;width:20%">${item.price * item.quantity}/- </td> 
    // <td style="font-weight: bold;width:40%">${item.productName}</td>

    category.items.forEach((item: any) => {

      content += `
      <tr>
      <td colspan="4" style="font-weight: bold;width:90%">${item.productName}</td>
      
      </tr>
      <tr>
      <td style="font-weight: bold;width:5%">&nbsp;</td>
      <td style="font-weight: bold;width:30%">${item.price}/- </td>
      <td style="font-weight: bold;width:30%"> ${item.quantity}</td> 
      <td style="font-weight: bold;width:30%">${item.price * item.quantity}/- </td> 
      </tr>

      `;

      let notesHtml = ``;
      if (item.notes === null || item.notes === undefined || item.notes === '') {
        //don't show notes data
      }
      else {
        notesHtml = ` <tr><td colspace='4'>Notes: ${item.notes} </td></tr>`;
        content += notesHtml;
      }

    });

    //Now close Table
    content += `</table>`

    finalHtml = titleHtml + content + lastHtmlTag; //+ `<hr>` ;//+ pageBreakHtml;

    return finalHtml;
  }

  //getCategoryGroupHtmlSinglePage(groupedCategories, tokenNumber, todaydatashow, category.categoryName, customerName);
  getCategoryGroupHtmlSinglePage(categoryList: any[], tokenNumber: any, todaydatashow: any, customerName: any) {
    let finalHtml = ``;

    let pageBreakHtml = `<div class="page-break"></div>`;

    let logo = environment.logoName;

    let titleHtml = `
      <div class="category">
      <img class="img-fluid img-thumbnail" src="` + logo + `" >
        <p style="text-align:left"><b> Token No.:` + tokenNumber + `</b><br>  
        Date & Time:   &nbsp;` + todaydatashow + `<br>
        Customer: ${customerName}   <br>
        </p>
        
      </div>  
      <div class="">
      `;

    let lastHtmlTag = `
  
      </div>
      `;


    //<h3>${counterName} Token</h3>
    let content = `
    
    <table class="table table-bordered table-hover align-middle text-center" style="width: 80%;">
    <tr>
    <th style="text-align: left;border-bottom: 2px solid black;">Item </th> 
    <th style="text-align: left;border-bottom: 2px solid black;"> Price</th> 
    <th style="text-align: left;border-bottom: 2px solid black;"> Qty </th> 
    <th style="text-align: left;border-bottom: 2px solid black;"> Total</th>
    </tr>
    
    `;

    //<td style="font-weight: bold;width:20%">${item.price}/- </td>
    // <td style="font-weight: bold;width:20%"> ${item.quantity}</td> 
    // <td style="font-weight: bold;width:20%">${item.price * item.quantity}/- </td> 
    // <td style="font-weight: bold;width:40%">${item.productName}</td>

    categoryList.forEach((category: any) => {

      category.items.forEach((item: any) => {

        content += `
      <tr>
      <td colspan="4" style="font-weight: bold;width:90%">${item.productName}</td>
      
      </tr>
      <tr>
      <td style="font-weight: bold;width:5%">&nbsp;</td>
      <td style="font-weight: bold;width:30%">${item.price}/- </td>
      <td style="font-weight: bold;width:30%"> ${item.quantity}</td> 
      <td style="font-weight: bold;width:30%">${item.price * item.quantity}/- </td> 
      </tr>

      `;

        let notesHtml = ``;
        if (item.notes === null || item.notes === undefined || item.notes === '') {
          //don't show notes data
        }
        else {
          notesHtml = ` <tr><td colspace='4'>Notes: ${item.notes} </td></tr>`;
          content += notesHtml;
        }

      });

    });


    //Now close Table
    content += `</table>`

    finalHtml = titleHtml + content + lastHtmlTag; //+ `<hr>` ;//+ pageBreakHtml;

    return finalHtml;
  }


  //Category#2
  /* ** This Method gets called from Main Page ********************************** */
  printCounterToken(cartDataList: CartHold, tokenNumber: any, todaydatashow: any, popupWin: any, dineInFlag: boolean, customerName: any) {

    //get the grouped categories from cartDataList
    const groupedCategories = this.groupItemsByCategory(cartDataList, dineInFlag);
    let finalHtml = ``;

    let popupWin2: any;

    // popupWin2 = window.open('', '', 'width=300,height=200');

    // popupWin2 = window.open('', '_blank');

    // if (popupWin2 != null || popupWin2 != undefined) {
    {

      //Get html Top Tag
      if (dineInFlag) {
        customerName = 'DINE-IN';
      }
      else if (customerName != null && customerName != undefined && customerName != '') {
        customerName = customerName;
      }

      else {
        customerName = 'WALK-IN';
      }


      let myHtmlTopTag = `
        <html> 
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge"> `;

      let cssStyle = this.getTokenStyle();   //this.getStyle();       


      let titleHtmlTag =
        `<title>  EZPZ POS Receipt </title>
        </head>
        <script>
              function handlePrint() {
                  window.print();

                  window.onafterprint = function() {
                  window.close(); // closes AFTER print dialog
                };
              }
          </script>    
        <body  onload="handlePrint();">  
        <div class="token-print">  
          <div class="header">
          `;
      //<button onclick="window.close()">Close</button>
      let lastHtmlTag = `
          </div>
              </div>
              
          </body>
        </html>
          `;

      let categoryGroupHtml = ``;
      let categoryGroupFinalHtml: any[] = [];
      let categoryGroupHtmlPageBreak = ``;

      let printTokenSinglePageFlag = environment.printTokenSinglePageFlag;

      if (printTokenSinglePageFlag) {

        categoryGroupHtml = this.getCategoryGroupHtmlSinglePage(groupedCategories, tokenNumber, todaydatashow, customerName);

        categoryGroupHtmlPageBreak = categoryGroupHtml;
        categoryGroupFinalHtml.push(categoryGroupHtmlPageBreak);


      }
      else {
        groupedCategories.forEach((category: any) => {

          //@@TODO Later
          //const printerIp = category.printerIp;

          categoryGroupHtml = this.getCategoryGroupHtml(category, tokenNumber, todaydatashow, category.categoryName, customerName);

          categoryGroupHtmlPageBreak = categoryGroupHtml;
          categoryGroupFinalHtml.push(categoryGroupHtmlPageBreak);

        });

      }




      let testFinalHtlTag = ``;
      popupWin2 = window.open('', '_blank');


      if (printTokenSinglePageFlag) {
        finalHtml = myHtmlTopTag + cssStyle + titleHtmlTag + categoryGroupFinalHtml.join('') + lastHtmlTag;
        popupWin2.document.write(finalHtml);
        testFinalHtlTag += finalHtml;
      }
      else {
        categoryGroupFinalHtml.forEach((content: any) => {

          // popupWin2 = window.open('', '_blank');
          if (popupWin2 != null || popupWin2 != undefined) {
            //categoryGroupFinalHtml: This html has one groups with items and titles
            finalHtml = myHtmlTopTag + cssStyle + titleHtmlTag + content + lastHtmlTag;
            popupWin2.document.write(finalHtml);

            testFinalHtlTag += finalHtml;
            // popupWin2.document.close();        
          }

        });

      }


      popupWin2.document.close();

      //finalHtml = finalHtml + lastHtmlTag;
      console.log(testFinalHtlTag);
      // popupWin2.document.write(finalHtml);

      // popupWin2.document.close();
      // Wait for content to load, then print
      // popupWin2.onload = function () {
      //   popupWin2!.focus();
      //   popupWin2!.print();

      //   // optional: close after print
      //   setTimeout(() => {
      //     popupWin2!.close();
      //   }, 500);
      // };

    }

    console.log(finalHtml);
    return finalHtml;
  }


  /* **************************************************** */
  //Category#3
  groupItemsByCategory(cartDataList: any, dineInFlag: boolean) {

    if (dineInFlag) {
      const grouped = cartDataList.items.reduce((acc: any, item: any) => {
        //Create new grouped by Category array, put all items in items[] array belong to one category
        if (!acc[item.categoryId!]) {
          acc[item.categoryId!] = {
            categoryName: item.subCategory,
            items: []
          };
        }

        acc[item.categoryId!].items.push(item);

        return acc;

      }, {});

      return Object.values(grouped);

    }
    else {
      const grouped = cartDataList.product.reduce((acc: any, item: any) => {
        //Create new grouped by Category array, put all items in items[] array belong to one category
        if (!acc[item.categoryId!]) {
          acc[item.categoryId!] = {
            categoryName: item.subCategory,
            items: []
          };
        }

        acc[item.categoryId!].items.push(item);

        return acc;

      }, {});

      return Object.values(grouped);

    }

  }


  //Category#2
  /* ** This Method gets called from Main Page ********************************** */
  printDineinToken(cartDataList: any, invoiceNumber: any, todaydatashow: any, popupWin: any,
    dineInFlag: boolean, customerName: any,
    tableName: any, agentName: any) {

    const groupedCategories = this.groupItemsByCategory(cartDataList, dineInFlag);
    let finalHtml = ``;

    let popupWin2: any;

    // popupWin2 = window.open('', '', 'width=300,height=200');

    // popupWin2 = window.open('', '_blank');

    // if (popupWin2 != null || popupWin2 != undefined) {
    {

      //Get html Top Tag
      if (dineInFlag) {
        customerName = 'DINE-IN';
      }
      else {
        customerName = 'WALK-IN';
      }


      let myHtmlTopTag = `
        <html> 
          <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge"> `;

      let cssStyle = this.getTokenStyle();   //this.getStyle();       

      //onload="window.print();window.close();"
      let titleHtmlTag =
        `<title>  EZPZ POS Receipt </title>
        </head>
        <script>
          function handlePrint() {
              window.print();

              window.onafterprint = function() {
              window.close(); // closes AFTER print dialog
            };
          }
      </script>    
        <body  onload="handlePrint();">
        <div class="token-print">  
          <div class="header">
          
          `;
      //<button onclick="window.close()">Close</button>
      let lastHtmlTag = `
          </div>
              </div>
              
          </body>
        </html>
          `;

      let categoryGroupHtml = ``;
      //let categoryGroupFinalHtml = ``;
      let categoryGroupHtmlPageBreak = ``;
      let categoryGroupFinalHtml: any[] = [];

      //Loop for Category
      groupedCategories.forEach((category: any) => {

        //@@TODO Later
        //const printerIp = category.printerIp;

        categoryGroupHtml = this.getCategoryGroupDineinHtml(category,
          invoiceNumber,
          todaydatashow,
          category.categoryName,
          customerName,
          tableName,
          agentName);

        //popupWin.document.write(finalHtml);
        categoryGroupHtmlPageBreak = categoryGroupHtml;
        categoryGroupFinalHtml.push(categoryGroupHtmlPageBreak);
        //categoryGroupFinalHtml += categoryGroupHtmlPageBreak;
        //console.log(finalHtml);

        //popupWin2.document.write(finalHtml);



      });

      let testFinalHtlTag = ``;
      popupWin2 = window.open('', '_blank');
      categoryGroupFinalHtml.forEach((content: any) => {

        // popupWin2 = window.open('', '_blank');
        if (popupWin2 != null || popupWin2 != undefined) {
          //categoryGroupFinalHtml: This html has one groups with items and titles
          finalHtml = myHtmlTopTag + cssStyle + titleHtmlTag + content + lastHtmlTag;
          popupWin2.document.write(finalHtml);

          testFinalHtlTag += finalHtml;
          // popupWin2.document.close();        
        }

      });

      popupWin2.document.close();

      //categoryGroupFinalHtml: This html has All groups with items and titles
      // finalHtml = myHtmlTopTag + cssStyle + titleHtmlTag + categoryGroupFinalHtml + lastHtmlTag

      //finalHtml = finalHtml + lastHtmlTag;
      //console.log(finalHtml);
      // popupWin2.document.write(finalHtml);
      // popupWin2.document.close();
      // Wait for content to load, then print
      // popupWin2.onload = function () {
      //   popupWin2!.focus();
      //   popupWin2!.print();

      // optional: close after print
      // setTimeout(() => {
      //   popupWin2.document.close();
      // }, 1500);

      //};

    }

    return finalHtml;
  }

  //Category#1
  getCategoryGroupDineinHtml(category: any, invoiceNumber: any, todaydatashow: any, counterName: any,
    customerName: any, tableName: any, agentName: any) {
    let finalHtml = ``;

    let pageBreakHtml = `<div class="page-break"></div>`;

    let logo = environment.logoName;

    let titleHtml = `
      <div class="category">
      <img class="img-fluid img-thumbnail" src="` + logo + `" >
        <p style="text-align:left"><b> Order No.:` + invoiceNumber + `</b><br>  
        Date & Time:   &nbsp;` + todaydatashow + `<br>
        Customer: ${customerName}   <br>
        Agent: ${agentName} <br>
        Table: ${tableName} <br>
        </p>
        
      </div>  
      <div class="">
      `;

    let lastHtmlTag = `
  
      </div>
      `;

    // let content = `
    //     <h3>${counterName} Token</h3>
    //     <ul style='font-size:18px;'>
    //     <li> Item &nbsp;&nbsp;&nbsp; Price &nbsp; Qty &nbsp; Total  </li>
    //   `;

    // category.items.forEach((item: any) => {
    //   let notesHtml = ``;

    //   // if (item.orderItemId === null) {
    //   if (item.notes === null || item.notes === undefined || item.notes === '') {
    //     //don't show notes data
    //   }
    //   else {
    //     notesHtml = ` <li>Notes: ${item.notes} </li>`;
    //   }
    //   // }  

    //   content += `<li> ${item.productName} &nbsp; ${item.price}/-   ${item.quantity} &nbsp;${item.price * item.quantity}/- </li>`;
    //   content += notesHtml;

    // });

    // content += `</ul>

    //   `;
    /*
        let content=`
        <h3>${counterName} Token</h3>
        <table class="table table-bordered table-hover align-middle text-center" style="width: 98%;">
        <tr>
        <th style="text-align: left">Item </th> <th> Price</th> <th> Qty </th> <th> Total</th>
        </tr>
        
        `;
    
        category.items.forEach((item: any) => {
    
          content+=`
          <tr>
          <td style="font-weight: bold;">${item.productName}</td>
          <td style="font-weight: bold;">${item.price}/- </td>
          <td style="font-weight: bold;"> ${item.quantity}</td> 
          <td style="font-weight: bold;">${item.price * item.quantity}/- </td> 
          </tr>
    
          `;
    
          let notesHtml = ``;
          if (item.notes === null || item.notes === undefined || item.notes === '') {
            //don't show notes data
          }
          else {
            notesHtml = ` <tr><td colspace='4'>Notes: ${item.notes} </td></tr>`;
            content+=notesHtml;
          }
          
    
        });
    
        //Now close Table
        content+=`</table>`
    
    */
    let content = `
    <h3>${counterName} Token</h3>
    <table class="table table-bordered table-hover align-middle text-center" style="width: 80%;">
    <tr>
    <th style="text-align: left;border-bottom: 2px solid black;">Item </th> 
    <th style="text-align: left;border-bottom: 2px solid black;"> Price</th> 
    <th style="text-align: left;border-bottom: 2px solid black;"> Qty </th> 
    <th style="text-align: left;border-bottom: 2px solid black;"> Total</th>
    </tr>
    
    `;


    category.items.forEach((item: any) => {

      content += `
      <tr>
      <td colspan="4" style="font-weight: bold;width:90%">${item.productName}</td>
      
      </tr>
      <tr>
      <td style="font-weight: bold;width:5%">&nbsp;</td>
      <td style="font-weight: bold;width:30%">${item.price}/- </td>
      <td style="font-weight: bold;width:30%"> ${item.quantity}</td> 
      <td style="font-weight: bold;width:30%">${item.price * item.quantity}/- </td> 
      </tr>

      `;

      let notesHtml = ``;
      if (item.notes === null || item.notes === undefined || item.notes === '') {
        //don't show notes data
      }
      else {
        notesHtml = ` <tr><td colspace='4'>Notes: ${item.notes} </td></tr>`;
        content += notesHtml;
      }


    });

    //Now close Table
    content += `</table>`





    finalHtml = titleHtml + content + lastHtmlTag; //+ `<hr>` ;//+ pageBreakHtml;

    return finalHtml;
  }



  /* *********************************************************** */

  getStyle(): string {

    let styleTag = `
     <style>
     
  .receipt_container {
    width: 76mm;
    max-width: 76mm;
    margin: 0 auto;
    font-family: monospace; /* 🔥 IMPORTANT for alignment */
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
    line-height: 1.5rem;
}
.inv_details table
{
    font-size: 8pt;
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
    font-size: 8pt;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    border-collapse: collapse;


}
.items table thead tr {
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
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
table tfoot {
    border-top: 3px solid #000 !important;
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
            padding: 1.25rem;
            background-color: #fff;
            /* border: 1px solid #dee2e6; 
            border-radius: 0.25rem; */
            max-width: 7.5rem;
            height: 2.5rem;
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
        font-size: 8pt;
        text-align: center;
        padding-left: 1%;
        padding-right: 1%;
    }

    @media print {
    body {
        margin: 0;
        padding: 0;
      }

      .receipt_container {
        width: 76mm;
        max-width: 80mm;
      font-family: monospace;
        page-break-after: always;
      }

      .token-print {
        width: 58mm;              /* or 80mm depending on printer */
        font-size: 10px;
        padding: 2px;
      }

      .token-print h5 {
        font-size: 12px;
        margin: 2px 0;
      }

      .token-print div {
        margin: 1px 0;
      }
      thead {
        display: table-row-group;  /* prevents repeat */
      }

      @page {
        size: 58mm auto;         /* 58mm auto; auto = height shrinks to content */
        margin: 0;
      }
            
        .page-break {
          page-break-before: always;
          }
            
        

    }
      .termCondition{
            font-size:8pt;
        }

    </style>`;


    return styleTag;
  }


  getTokenStyle() {
    let tokenCss = `
    <style>
    @media print {
      @page {
        size: 80mm auto;
        margin: 0;
      }

      body {
        margin: 0;
        padding: 2px;
        font-size: 14px;
      }

      .token-print {
        width: 80mm;
        line-height: 1.1;
        font-size: 14px;
      }

      .token-print * {
        margin: 0;
        padding: 0;
      }

      .category {
        page-break-before: always;
      }

      .category:last-child {
        page-break-after: auto; /* or avoid */
      }

    }/* Media Print Ends */


     .img-fluid {
            max-width: 100%;
            height: auto;
        }

        .img-thumbnail {
            padding: 1.25rem;
            background-color: #fff;
            /* border: 1px solid #dee2e6; 
            border-radius: 0.25rem; */
            max-width: 7.5rem;
            height: 2.5rem;
        }

      </style>
  `;

    return tokenCss;


  }
  /* ******************************* */


  async printDailyCloseSale(): Promise<boolean> {

    let bRet = false;
    let currency = environment.currency;
    let totalSaleCount = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let totalSaleAmount = 0;
    let totalNetSale = 0;

    let totalSaleCountCat = 0;
    let totalDiscountCat = 0;
    let totalTaxCat = 0;
    let totalSaleAmountCat = 0;
    let totalNetSaleCat = 0;

    let dailySaleReport: OrderSaleDailyReport[] = [];
    let saleByCategoryTotalReport: CategorySalePrice[] = [];

    try {

      const dailyData: OrderSaleReportResponse =
        await firstValueFrom(this.reportsService.getDailySaleByType());

      const categoryData: CategorySaleResponse =
        await firstValueFrom(this.reportsService.categoryTotalSale());

      let dailySaleReport = dailyData.orderSaleDailyReport;
      let saleByCategoryTotalReport = categoryData.catSale;

      // 👉 your existing calculations here (unchanged)
      dailySaleReport.forEach(item => {
        totalSaleCount += item.orderCount;
        totalDiscount += item.discount;
        totalTax += item.tax;
        totalSaleAmount += item.grandTotal;
        totalNetSale += (item.grandTotal + item.tax);

      });

      saleByCategoryTotalReport.forEach(item => {
        totalSaleCountCat += item.noOfOrders;
        totalTaxCat += item.totalTax;
        totalDiscountCat += item.totalDiscount;
        totalSaleAmountCat += item.salePrice;
        totalNetSaleCat += (item.salePrice + item.totalTax);

      });

      //build html to print on Thermal Printer
      let finalContentHTML1 = ``;

      let tableHTML1 =
        `
          <p> Daily Sale at Closing </p>
          <table class="table table-bordered table-hover align-middle text-center">

          <thead class="table-light">
            <tr>
              <th class="text-start">Types</th>
              <th>Count</th>
              <th>Sales (${currency})</th>
              <th>Tax (${currency})</th>
              <th>Disc (${currency})</th>
              <th>Net (${currency})</th>
            </tr>
          </thead>

          <tbody>
          `;

      let trHTML1 = ``;
      for (let dailySale of dailySaleReport) {

        trHTML1 += `
              <tr >
                <td class="text-start fw-semibold"> ${dailySale.orderType} </td>
                <td> ${dailySale.orderCount} </td>
                <td> ${(dailySale.grandTotal.toFixed(2))} </td>
                <td> ${dailySale.tax.toFixed(2)} </td>
                <td> ${dailySale.discount} </td>
                <td class="fw-bold text-success"> ${(dailySale.grandTotal + dailySale.tax).toFixed(2)} </td>
              </tr>`;
      }

      let tFootHTML1 = `  
          </tbody>

          <tfoot class="table-light fw-bold">
            <tr>
              <td class="text-start totalSale">Total</td>
              <td class="totalSale"> ${totalSaleCount}</td>
              <td class="totalSale"> ${totalSaleAmount} </td>
              <td class="totalSale"> ${totalTax.toFixed(2)} </td>
              <td class="totalSale"> ${totalDiscount.toFixed(2)} </td>
              <td class="totalSale"> ${totalNetSale.toFixed(2)} </td>
            </tr>
          </tfoot>

        </table>`;

      finalContentHTML1 = tableHTML1 + trHTML1 + tFootHTML1;

      //////////////////////////////////////////////////////////
      //Sale by Category
      let finalContentHTML2 = ``;

      let tableHTML2 =
        `
          <br>
          <p> Daily Sale at Closing By Category </p>
          <table class="table table-bordered table-hover align-middle text-center">

          <thead class="table-light">
            <tr>
              <th class="text-start">Caetgory</th>
              <th>Count</th>
              <th>Sales (${currency})</th>
              <th>Disc (${currency})</th>
              <th>Tax (${currency})</th>
              <th>Net (${currency})</th>
            </tr>
          </thead>

          <tbody>
          `;

      let trHTML2 = ``;
      for (let dailySale of saleByCategoryTotalReport) {

        trHTML2 += `
              <tr >
                <td class="text-start fw-semibold"> ${dailySale.categoryName} </td>
                <td> ${dailySale.noOfOrders} </td>
                <td> ${dailySale.salePrice.toFixed(2)} </td>
                <td> ${dailySale.totalDiscount.toFixed(2)} </td>
                <td> ${dailySale.totalTax.toFixed(2)} </td>
                <td class="fw-bold text-success"> ${(dailySale.salePrice + dailySale.totalTax).toFixed(2)} </td>
              </tr>`;
      }

      let tFootHTML2 = `  
          </tbody>

          <tfoot class="table-light fw-bold">
            <tr>
              <td class="text-start totalSale">Total</td>
              <td class="totalSale"> ${totalSaleCountCat}</td>
              <td class="totalSale"> ${totalSaleAmountCat} </td>
              <td class="totalSale"> ${totalDiscountCat.toFixed(2)} </td>
              <td class="totalSale"> ${totalTaxCat.toFixed(2)} </td>
              <td class="totalSale"> ${totalNetSaleCat.toFixed(2)} </td>
            </tr>
          </tfoot>

        </table>`;

      finalContentHTML2 = tableHTML2 + trHTML2 + tFootHTML2;

      let finalContentHTML = finalContentHTML1 + finalContentHTML2;


      this.printThermalContent(finalContentHTML);

      bRet = true;

    } catch (error) {
      console.error('Error in printDailyCloseSale:', error);
      bRet = false;
    }

    return bRet;
  }
  /* ************************************************* */
  printThermalContent(contentHTML: any): void {

    //let popupWin;
    let popupWin: Window | null;

    let todaydatashow = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en-US');

    let logo = environment.logoName;

    popupWin = window.open('', '_blank');
    let myFlag = true;



    if (popupWin != null || popupWin != undefined) {

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
             <script>
          function handlePrint() {
              window.print();

              window.onafterprint = function() {
              window.close(); // closes AFTER print dialog
            };
          }
      </script>    
        <body  onload="handlePrint();">  
    
        <div class="receipt_container">  
          <div class="header">
          <img class="img-fluid img-thumbnail" src="` + mainImage + `" >`;


      let myHtml02Tag = `
      <div class="inv_details">
        <p style="font-size: 8pt;text-align:left; line-height:1rem">  
          Date & Time:   &nbsp; ${todaydatashow} <br>
        </p>
        
      </div>  
      <div class="items">
      
      `;
      //<button onclick="window.close()">Close</button>
      let lastHtmlTag = `
            </div>
          </div>
        </div>
        
      </body>
    </html>
      `;


      let finalHTMLTag = ``;
      //Add all hmt tags
      finalHTMLTag = myHtml01Tag + styleTag + titleHtmlTag + myHtml02Tag + contentHTML + lastHtmlTag;

      //1st copy
      popupWin.document.write(finalHTMLTag);
      //console.log(finalHTMLTag)
      popupWin.document.close();

      // Wait for content to load, then print
      // popupWin.onload = function () {
      //   popupWin!.focus();
      //   popupWin!.print();

      //   // optional: close after print
      //   setTimeout(() => {
      //     popupWin!.close();
      //   }, 500);
      // };

    }//popupWin

  }


  /* ********************************************************************************** */
  printSentToKitchenAfterOrder(orderNum: any, todaydatashow: any, cart: any, selectedTableId: any, itemsArray: any) {

    let addedItemNewFlag = false;

    cart.items.forEach((item: any) => {
      if (item.orderItemId === null) {
        //New Item
        addedItemNewFlag = true;
      }
      else if (itemsArray === null) {
        addedItemNewFlag = false;
      }
      else {
        addedItemNewFlag = true;
      }
    });

    //Only print for new items
    if (!addedItemNewFlag) return;

    //let popupWin;
    let popupWin: Window | null;

    popupWin = window.open('', '_blank');
    let myFlag = true;
    if (popupWin != null || popupWin != undefined) {
      let myHtml01Tag = `
      <html> 
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge"> `;

      let titleHtmlTag =
        `<title>Send to Kitchen</title>
      </head>
     <script>
          function handlePrint() {
              window.print();

              window.onafterprint = function() {
              window.close(); // closes AFTER print dialog
            };
          }
      </script>    
        <body  onload="handlePrint();">  

      <div class="recipt_container">  
        <div class="header"> 
          <p style="text-align:left"><b> Date:` + todaydatashow + `</b></p>
          <p style="text-align:left"><b> Order#:${orderNum}-001  Table:${selectedTableId} </b></p>
          <hr>
        
        `;

      let bodyHtml = ` `;

      cart.items.forEach((item: any) => {
        //Only add new item
        let notesHtml = ``;
        if (item.orderItemId === null) {
          if (item.notes === null || item.notes === undefined || item.notes === '') {
            //don't show notes data
          }
          else {
            notesHtml = ` <p>Notes: ${item.notes} </p>`;
          }

          bodyHtml += `<p style="text-align:left"> ${item.productName} x ${item.quantity} </p> ${notesHtml}`;


        }
        else if (itemsArray !== null) {
          //This is the case when item was already added in DB, Customer requested another Qty for same item
          let foundItem = itemsArray.find((arrItem: any) => arrItem.productId === item.productId);

          if (foundItem) {
            if (item.notes === null || item.notes === undefined || item.notes === '') {
              //don't show notes data
            }
            else {
              notesHtml = ` <p>Notes: ${item.notes} </p>`;
            }
            //match/find same productId

            bodyHtml += `<p style="text-align:left"> ${item.productName} x ${foundItem.quantity} </p> ${notesHtml}`;


          }

        }
      });

      let footerHtml = ``;
      if (cart.order.notes === null) {
        footerHtml = `
              </div>
            </div>
        </body>
        </html>
        `;

      }
      else {
        footerHtml = `
                <p> Special Instructions: ${cart.order.notes} </p>
              </div>
            </div>
        </body>
        </html>
        `;
      }


      //   let footerHtml = `
      //         <p> Special Instructions: ${this.cartsByTable[this.selectedTableId].order.notes} </p>            
      //       </div>
      //     </div>
      //  </body>
      // </html>
      // `;

      let finalHtmlTag = myHtml01Tag + titleHtmlTag + bodyHtml + footerHtml;
      // console.log(finalHtmlTag);
      popupWin.document.write(finalHtmlTag);
      popupWin.document.close();

      // Wait for content to load, then print
      popupWin.onload = function () {
        popupWin!.focus();
        popupWin!.print();

        // optional: close after print
        setTimeout(() => {
          popupWin!.close();
        }, 500);
      };

    }

  }


  /* *********************************************************************************** */
  printSentToKitchen(orderNum: any, todaydatashow: any, cart: any, selectedTableId: any) {

    let addedItemNewFlag = false;
    cart.items.forEach((item: any) => {
      if (item.orderItemId === null) {
        addedItemNewFlag = true;
      }
    });

    //Only print for new items
    if (!addedItemNewFlag) return;

    //let popupWin;
    let popupWin: Window | null;

    popupWin = window.open('', '_blank');

    if (!popupWin) {
      alert('Popup blocked');
      return;
    }

    let myFlag = true;
    if (popupWin != null || popupWin != undefined) {
      let myHtml01Tag = `
      <html> 
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge"> `;

      let titleHtmlTag =
        `<title>Send to Kitchen</title>
      </head>    
      <body  >
      <div class="recipt_container">  
        <div class="header"> 
          <p style="text-align:left"><b> Date:` + todaydatashow + `</b></p>
          <p style="text-align:left"><b> Order#:${orderNum} Table:${selectedTableId} </b></p>
          <hr>
        
        `;

      let bodyHtml = ` `;

      cart.items.forEach((item: any) => {
        //Only add new item
        let notesHtml = ``;
        if (item.orderItemId === null) {
          if (item.notes === null || item.notes === undefined || item.notes === '') {
            //don't show notes data
          }
          else {
            notesHtml = ` <p>Notes: ${item.notes} </p>`;
          }
          bodyHtml += `<p style="text-align:left"> ${item.productName} x ${item.quantity} </p> ${notesHtml}`;
        }
      });

      let footerHtml = ``;
      if (cart.order.notes === null) {
        footerHtml = `
              </div>
            </div>
        </body>
        </html>
        `;

      }
      else {
        footerHtml = `
                <p> Special Instructions: ${cart.order.notes} </p>
              </div>
            </div>
        </body>
        </html>
        `;
      }


      let finalHtmlTag = myHtml01Tag + titleHtmlTag + bodyHtml + footerHtml;

      popupWin.document.write(finalHtmlTag);
      popupWin.document.close();

      // Wait for content to load, then print
      popupWin.onload = function () {
        popupWin!.focus();
        popupWin!.print();

        // optional: close after print
        setTimeout(() => {
          popupWin!.close();
        }, 500);
      };

    }
  }






}
