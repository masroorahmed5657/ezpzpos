import { Component } from '@angular/core';

@Component({
  selector: 'app-adjustment-settlement',
  templateUrl: './adjustment-settlement.component.html',
  styleUrls: ['./adjustment-settlement.component.scss']
})
export class AdjustmentSettlementComponent {

settlementStatus='';
creditNote:any;
netAmount=0;
settlement:any;

creditNoteCheck(){
  if (this.settlementStatus === 'STORE_PAY') {
  this.creditNote = {
    noteNo: 'CN-' + Date.now(),
    amount: Math.abs(this.netAmount),
    validTill: this.addDays(new Date(), 30)
  };
}

}
addDays(curDt:any, days:any){

}

completeAdjustment(){
  
}


}
