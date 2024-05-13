import { CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CurrencyPipe, ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  calculatorForm: FormGroup;

  tipAmountPerPerson = 0;
  totalPerPerson = 0;

  ngOnInit(): void {
    this.calculatorForm.valueChanges.subscribe(() => {
      this.calculateOutput();
    });

    this.calculatorForm
      .get('customTipPercentage')
      ?.valueChanges.subscribe(() => {
        this.uncheckTipRadios();
      });

    this.calculatorForm.get('tipPercentage')?.valueChanges.subscribe(() => {
      this.emptyCustomTipPercentage();
    });
  }

  constructor(private fb: FormBuilder, private elementRef: ElementRef) {
    this.calculatorForm = this.fb.group({
      billAmount: new FormControl('', Validators.min(0)),
      tipPercentage: '',
      customTipPercentage: new FormControl('', Validators.min(0)),
      numOfPeople: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.pattern('^[0-9]*$'),
      ]),
    });
  }

  isDefault() {
    const billAmount = this.calculatorForm.get('billAmount')?.value;
    const tipPercentage = this.calculatorForm.get('tipPercentage')?.value;
    const customTipPercentage = this.calculatorForm.get(
      'customTipPercentage'
    )?.value;
    const numOfPeople = this.calculatorForm.get('numOfPeople')?.value;

    return (
      billAmount == '' &&
      tipPercentage == '' &&
      numOfPeople == '' &&
      customTipPercentage == ''
    );
  }

  resetForm() {
    this.calculatorForm.reset({
      billAmount: '',
      tipPercentage: '',
      customTipPercentage: '',
      numOfPeople: '',
    });
    this.tipAmountPerPerson = 0;
    this.totalPerPerson = 0;
  }

  getFieldError(fieldName: string) {
    const field = this.calculatorForm.get(fieldName);

    if (!field?.touched && !field?.dirty) {
      return '';
    }

    if (field?.hasError('required')) {
      return "Can't be blank";
    }

    if (field?.hasError('pattern')) {
      if (field.errors!['pattern']['requiredPattern'] == '^[0-9]*$') {
        return 'Must be integer';
      }
      return 'Invalid value';
    }

    if (field?.hasError('min')) {
      const min = field.errors!['min'];
      if (min['min'] == 1 && min['actual'] == 0) {
        return "Can't be zero";
      }

      if (min['actual'] < 0) {
        return "Can't be negative";
      }

      return 'Invalid value';
    }
    return '';
  }

  isFieldInvalid(fieldName: string) {
    const field = this.calculatorForm.get(fieldName);
    if (!field?.dirty && !field?.touched) {
      return false;
    }
    const keys = Object.keys(field.errors || {});
    return field?.invalid;
  }

  calculateOutput(): void {
    if (this.calculatorForm.invalid) {
      this.tipAmountPerPerson = 0;
      this.totalPerPerson = 0;
      return;
    }
    const billAmount = parseInt(
      this.calculatorForm.get('billAmount')!.value || 0
    );
    const tipPercentage = Math.max(
      parseInt(this.calculatorForm.get('tipPercentage')?.value || 0),
      parseInt(this.calculatorForm.get('customTipPercentage')?.value || 0)
    );

    const numOfPeople = parseInt(this.calculatorForm.get('numOfPeople')!.value);

    const tipAmount = billAmount * (tipPercentage / 100);
    this.tipAmountPerPerson = tipAmount / numOfPeople;
    this.totalPerPerson = (billAmount + tipAmount) / numOfPeople;
  }

  uncheckTipRadios(): void {
    if (this.calculatorForm.get('customTipPercentage')?.value !== '') {
      this.calculatorForm.get('tipPercentage')?.setValue('');
    }
  }

  emptyCustomTipPercentage(): void {
    if (this.calculatorForm.get('tipPercentage')?.value !== '') {
      this.calculatorForm.get('customTipPercentage')?.setValue('');
    }
  }

  OnSubmit() {
    this.resetForm();
  }
}
