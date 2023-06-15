import { Product } from './../../interfaces/product';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GeneralObject } from 'src/app/interfaces/general-object';
import { SpotSolarService } from 'src/app/services/spot-solar.service';
import Swal from 'sweetalert2';

import { Proposal } from '../../interfaces/proposal';
import { ViewPdfComponent } from '../view-pdf/view-pdf.component';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  private dialog = inject(MatDialog);
  private spotSolarService = inject(SpotSolarService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  public loadingService = inject(LoadingService);
  title = 'Nova proposta'
  proposalId = '';
  isLoading = false;
  paymentMethods: GeneralObject[] = [
    { id: 1, value: 'PIX' },
    { id: 2, value: 'Boleto' },
    { id: 3, value: 'Cartão de Crédito até 12x' },
    { id: 4, value: 'Financiado em até 370x' },
  ];
  proposalForm = this.fb.group({
    customerFullName: ['', Validators.required],
    customerEmail: ['', [Validators.required, Validators.email]],
    customerTelephoneNumber: ['', Validators.required],
    serviceType: [0, Validators.required],
    warrantyType: [0, Validators.required],
    warrantyQtd: [0, Validators.required],
    excecutionTime: [0, Validators.required],
    power: [''],
    zipCode: ['', Validators.required],
    street: ['', Validators.required],
    neighborhood: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    products: this.fb.array([]),
    totalPriceProducts: [0, Validators.required],
    labourValue: [0, Validators.required],
    totalPrice: [0, Validators.required],
    notes: ['', Validators.maxLength(255)],
    paymentMethods: ['', Validators.required],
  });
  ngOnInit(): void {
    this.editProposal();
  }
  onSubmit(): void {
    this.createProposal();
    // if (this.proposalForm.valid) {
    //   if (this.proposalId !== undefined) {
    //     this.updateProposal();
    //   }
    // } else {
    //   this.showMessageError();
    // }
  }
  private editProposal() {
    this.getIdFromParams();
    if (this.proposalId !== undefined) {
      this.title = 'Editar proposta'
      let res = this.spotSolarService.getById(this.proposalId)
      console.log(res.value)
    }
  }
  addProduct(): void {
    const product = this.fb.group({
      name: [null, Validators.required],
      quantity: [null, Validators.required],
    });
    this.products.push(product);
  }
  removeProduct(index: number): void {
    this.products.removeAt(index);
  }
  sumTotalPrice() {
    let sum = 0;
    this.labourValue.value ? sum += this.labourValue.value : sum += 0;
    this.totalPriceProducts.value ? sum += this.totalPriceProducts.value : sum += 0;
    this.totalPrice.setValue(sum);
  }

  private getIdFromParams() {
    this.route.params.subscribe(params => {
      this.proposalId = params['id'];
    });
  }
  private createProposal() {
    this.spotSolarService.createProposal(this.proposalForm.value);
  }
  private showMessageError() {
    Swal.fire({
      title: 'Erro ao criar proposta!',
      text: 'Por favor, verifique se todos os campos foram preenchidos corretamente.',
      icon: 'error',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    });
  }
  private viewProposalOnPDF(): void {
    const dialogRef = this.dialog.open(ViewPdfComponent, {
      data: this.proposalForm.value,
      width: '610px',
      height: '90%',
    })
  }
  private fillFormWhenEdit(proposal: Proposal) {
    proposal.products.forEach(item => {
      const product = this.fb.group({
        name: [item.name, Validators.required],
        quantity: [item.quantity, Validators.required],
      });
      this.products.push(product);
    });
    this.proposalForm.patchValue({
      customerFullName: proposal?.customerFullName,
      customerEmail: proposal?.customerEmail,
      customerTelephoneNumber: proposal?.customerTelephoneNumber,
      serviceType: proposal?.serviceType,
      warrantyType: proposal?.warrantyType,
      warrantyQtd: proposal?.warrantyQtd,
      excecutionTime: proposal?.excecutionTime,
      power: proposal?.power,
      zipCode: proposal?.zipCode,
      street: proposal?.street,
      neighborhood: proposal?.neighborhood,
      city: proposal?.city,
      state: proposal?.state,
      notes: proposal?.notes,
      products: proposal?.products,
      totalPriceProducts: proposal?.totalPriceProducts,
      labourValue: proposal?.labourValue,
      totalPrice: proposal?.totalPrice,
      paymentMethods: proposal?.paymentMethods,
    });
  }
  get totalPriceProducts() {
    return this.proposalForm.get('totalPriceProducts') as FormControl;
  }
  get totalPrice() {
    return this.proposalForm.get('totalPrice') as FormControl;
  }
  get labourValue() {
    return this.proposalForm.get('labourValue') as FormControl;
  }
  get products() {
    return this.proposalForm.get('products') as FormArray;
  }
  get customerFullName() {
    return this.proposalForm.get('customerFullName') as FormControl;
  }
  get email() {
    return this.proposalForm.get('customerEmail') as FormControl;
  }
  get telephoneNumber() {
    return this.proposalForm.get('customerTelephoneNumber') as FormControl;
  }
}
