import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  tipAmountPerPerson: number = 0;
  totalPerPerson: number = 0;
  PreviousTipPercentage = 0;

  calculatorForm = new FormGroup({
    billAmount: new FormControl<number | null>(null, [Validators.required]),
    tipPercentage: new FormControl<number | null>(null, [Validators.required]),
    numOfPeople: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
  });

  constructor(private elementRef: ElementRef) {}

  isDefault() {
    const billAmount = this.calculatorForm.get('billAmount')?.value || 0;
    const tipPercentage = this.calculatorForm.get('tipPercentage')?.value || 0;
    const numOfPeople = this.calculatorForm.get('numOfPeople')?.value || 0;

    return billAmount == 0 && tipPercentage == 0 && numOfPeople == 0;
  }

  resetForm() {
    this.calculatorForm.reset({
      billAmount: 0,
      tipPercentage: 0,
      numOfPeople: 0,
    });
  }

  calculateOutput(e: Event) {
    const billAmount = this.calculatorForm.get('billAmount')?.value || 0;
    const tipPercentage = this.calculatorForm.get('tipPercentage')?.value || 0;
    const numOfPeople = this.calculatorForm.get('numOfPeople')?.value || 1;

    if ((e.target as HTMLElement).id === 'customPercentage') {
      this.handleCustomPercentageChange(tipPercentage);
    } else if ((e.target as HTMLInputElement).type === 'radio') {
      this.handleRadioPercentageChange(tipPercentage);
    }

    let tipAmount = (billAmount * tipPercentage) / 100;

    let total = billAmount + tipAmount;

    this.tipAmountPerPerson = tipAmount / numOfPeople;
    this.totalPerPerson = total / numOfPeople;

    console.log(this.totalPerPerson);
  }

  handleCustomPercentageChange(tipPercentage: number) {
    if (tipPercentage != this.PreviousTipPercentage && tipPercentage > 0) {
      console.log(this.PreviousTipPercentage, tipPercentage);
      const radios = this.elementRef.nativeElement.querySelectorAll(
        'input[type="radio"]:checked'
      );

      console.log(radios);

      radios?.forEach((radio: HTMLInputElement) => {
        radio.checked = false;
      });
    }
    this.PreviousTipPercentage = tipPercentage;
  }

  handleRadioPercentageChange(tipPercentage: number) {
    const customPercentage = this.elementRef.nativeElement.querySelector(
      '#customPercentage'
    ) as HTMLInputElement;

    customPercentage.value = '';
    this.PreviousTipPercentage = tipPercentage;
  }
}
