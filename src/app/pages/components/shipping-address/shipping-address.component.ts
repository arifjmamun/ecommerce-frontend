import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { getCountries, getStates, ICountry, IState } from '../../../data/country-states.data';
import { AsyncService } from '../../../shared/services/async.service';
import { Customer } from '../../../models/customer.model';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss']
})
export class ShippingAddressComponent implements OnInit, OnDestroy {
  public shippingAddressForm: FormGroup;
  public countryList: ICountry[] = [];
  public selectedCountry = 'Bangladesh';
  public stateList: IState[] = [];
  public selectedState = 'Dhaka';
  public rowGutter = { xs: 8, sm: 16, md: 24, lg: 32, xl: 32, xxl: 32 };

  public sub: Subscription;
  public customer: Customer;

  @Input()
  public allowSkip = true;

  @Input()
  public set customerData(value: Customer) {
    this.customer = value;
    if (!this.shippingAddressForm) {
      return;
    }
    this.initilizeForm();
  }

  @Input()
  public buttonText = 'Next';


  @Output()
  public completeStep = new EventEmitter<Customer>(null);

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

  constructor(private fb: FormBuilder, public asyncService: AsyncService, private userService: UserService) {}

  ngOnInit(): void {
    this.shippingAddressForm = this.fb.group({
      sameToBillingAddress: [false, Validators.required],
      phoneNo: [null, Validators.required],
      email: [null, Validators.email],
      fullName: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      country: [null, Validators.required],
      state: [null, Validators.required],
      address: [null, Validators.required],
      city: [null, Validators.required],
      postalCode: [null, Validators.required]
    });

    this.countryList = getCountries();
    this.initilizeForm();
  }

  public initilizeForm(): void {
    if (this.customer && this.customer.shippingAddress) {
      this.shippingAddressForm.patchValue(this.customer.shippingAddress);
    } else {
      if (this.customer) {
        this.shippingAddressForm.patchValue({
          phoneNo: this.customer.phoneNo,
          fullName: this.customer.fullName,
          email: this.customer.email || null
        });
      }
    }
  }

  public onChangeCountry(): void {
    if (this.selectedCountry) {
      this.stateList = getStates(this.selectedCountry);
      this.selectedState = this.stateList[0].name;
    }
  }

  public updateShippingAddress(): void {
    if (this.customer && this.shippingAddressForm.valid) {
      this.asyncService.start();
      this.sub = this.userService.updateShippingAddress(this.customer.id, this.shippingAddressForm.value).subscribe(
        (response) => {
          if (response.success && response.result) {
            this.customer = response.result;
            this.completeStep.emit(response.result);
          }
          this.asyncService.finish();
        },
        (error) => {
          console.log(error);
          this.asyncService.finish();
        }
      );
    }
  }

  public toggleSameToBillingAddress(checked: boolean): void {
    if (checked && this.customer.billingAddress) {
      this.shippingAddressForm.patchValue(this.customer.billingAddress);
    }
  }

  public skipThisStep(): void {
    this.completeStep.emit(null);
  }

  ngOnDestroy(): void {
    if (this.asyncService) {
      this.asyncService.finish();
    }
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
