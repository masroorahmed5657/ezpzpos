import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pos-fashion',
  templateUrl: './pos-fashion.component.html',
  styleUrls: ['./pos-fashion.component.scss']
})
export class PosFashionComponent {


  currency=environment.currency;
  term = environment.termHtmlTag;
  contact=environment.contactHtmlTag;

}
