import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { CheckoutService } from '../checkout.service';
import { PaymentMethod } from '../models';
import { AsyncService } from '../../../../shared/services/async.service';

@Component({
  selector: 'choose-payment-method',
  templateUrl: './choose-payment-method.component.html',
  styleUrls: ['./choose-payment-method.component.scss']
})
export class ChoosePaymentMethodComponent implements OnInit, OnDestroy {
  public selectedMethod: PaymentMethod;
  public paymentMethods: PaymentMethod[] = [];

  @Output()
  public selected = new EventEmitter<PaymentMethod>();

  constructor(private checkoutService: CheckoutService, private asyncService: AsyncService) {}

  ngOnInit() {
    this.getPaymentMethods();
  }

  public getPaymentMethods(): void {
    this.asyncService.start();
    this.checkoutService.getPaymentMethods().subscribe(
      (response) => {
        if (response && response.success && response.result) {
          this.paymentMethods = response.result;
        }
        this.asyncService.finish();
      },
      (error) => {
        console.log(error);
        this.paymentMethods = [];
        this.asyncService.finish();
      }
    );
  }

  public selectShippingMethod(method: PaymentMethod): void {
    this.selectedMethod = method;
    this.selected.emit(method);
  }

  ngOnDestroy() {
    if (this.asyncService) {
      this.asyncService.finish();
    }
  }
}
