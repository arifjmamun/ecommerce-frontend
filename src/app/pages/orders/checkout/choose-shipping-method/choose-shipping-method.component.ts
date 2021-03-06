import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { CheckoutService } from '../checkout.service';
import { ShippingMethod } from '../models/shipping-method.model';
import { AsyncService } from '../../../../shared/services/async.service';

@Component({
  selector: 'choose-shipping-method',
  templateUrl: './choose-shipping-method.component.html',
  styleUrls: ['./choose-shipping-method.component.scss'],
})
export class ChooseShippingMethodComponent implements OnInit, OnDestroy {
  public selectedMethod: ShippingMethod;
  public shippingMethods: ShippingMethod[] = [];

  @Output()
  public selected = new EventEmitter<ShippingMethod>();

  constructor(private checkoutService: CheckoutService, private asyncService: AsyncService) {}

  ngOnInit() {
    this.getShippingMethods();
  }

  public getShippingMethods(): void {
    this.asyncService.start();
    this.checkoutService.getShippingMethods().subscribe(
      (response) => {
        if (response && response.success && response.result) {
          this.shippingMethods = response.result;
        }
        this.asyncService.finish();
      },
      (error) => {
        console.log(error);
        this.shippingMethods = [];
        this.asyncService.finish();
      }
    );
  }

  public selectShippingMethod(method: ShippingMethod): void {
    this.selectedMethod = method;
    this.selected.emit(method);
  }

  ngOnDestroy() {
    if (this.asyncService) {
      this.asyncService.finish();
    }
  }
}
