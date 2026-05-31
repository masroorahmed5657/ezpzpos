import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { faSignOut, faClose, faPrint, faList, faCloudUpload, faCloudDownload, faPerson, faCreditCard, faCashRegister, faPlusSquare, faDashboard, faRemove, faRupeeSign, faDollar, faCar, faHome, faSave, faUndo, faFilter, faEdit, faPlusCircle, faHistory, faFileInvoiceDollar, faShoppingCart, faSort, faSearch } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { CacheService } from '../services/cache.service';
import { CustomerService } from '../services/customer.service';
import { DepartmentsService } from '../services/departments.service';
import { LoginService } from '../services/login.service';
import { OrdersService } from '../services/orders.service';
import { PaymentService } from '../services/payment.service';
import { PrintService } from '../services/print.service';
import { ProductService } from '../services/product.service';
import { ReportsService } from '../services/reports.service';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Customer, OrderResponse, Orders, OrderSaveResponse, OrdersCustomerWrapper, OrderSearch, Payment, PriceSummary } from '../model/model-classes.model';
import { DeliveryService } from '../services/delivery.service';
import { DriverDelivery, Drivers } from '../data-type';


@Component({
  selector: 'app-rider',
  templateUrl: './rider.component.html',
  styleUrls: ['./rider.component.scss']
})
export class RiderComponent {
currentStatus: string = 'AVAILABLE';

  activeOrder: any = {
    orderId: 1025,
    customerName: 'John Doe',
    deliveryAddress: '123 Main Street, Karachi',
    phone: '03001234567'
  };

  statusList: string[] = [
    'AVAILABLE',
    'OUT-FOR-DELIVERY',
    'DELIVERED',
    'BREAK',
    'OFFLINE'
  ];

constructor(
    private router: Router,
    private cache: CacheService,
    private orderService: OrdersService,
    private customerService: CustomerService,
    private userService: UserService,
    private paymentService: PaymentService,
    private reportsService: ReportsService,
    private loginService: LoginService,
    private printService: PrintService,
    private deliveryService: DeliveryService

  ) { }


  updateStatus(status: string) {
    this.currentStatus = status;

    // this.api.updateDriverStatus({
    //   driverId: this.driverId,
    //   status: status
    // }).subscribe();
  }

  markDelivered() {
    if (!this.activeOrder) return;

    // this.api.markDelivered({
    //   orderId: this.activeOrder.orderId,
    //   deliveredTime: new Date()
    // }).subscribe(() => {
    //   this.activeOrder = null;
    //   this.currentStatus = 'AVAILABLE';
    // });
  }

  signOut() {
    // clear session / token
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getStatusClass(status: string) {
    return {
      'available active': status === 'AVAILABLE' && this.currentStatus === status,
      'out active': status === 'OUT-FOR-DELIVERY' && this.currentStatus === status,
      'delivered active': status === 'DELIVERED' && this.currentStatus === status,
      'break active': status === 'BREAK' && this.currentStatus === status,
      'offline active': status === 'OFFLINE' && this.currentStatus === status
    };
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'bi bi-check-circle';
      case 'OUT-FOR-DELIVERY': return 'bi bi-bicycle';
      case 'DELIVERED': return 'bi bi-box-seam';
      case 'BREAK': return 'bi bi-cup-hot';
      case 'OFFLINE': return 'bi bi-power';
      default: return 'bi bi-circle';
    }
  }

  driverId: number = 1;
}