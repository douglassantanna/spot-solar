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
  proposalId = 0;
  isLoading = false;
  paymentMethods: GeneralObject[] = [
    { id: 1, value: 'PIX' },
    { id: 2, value: 'Boleto' },
    { id: 3, value: 'Cartão de Crédito até 12x' },
    { id: 4, value: 'Financiado em até 370x' },
  ];
  proposalForm = this.fb.group({
    rowKey: [''],
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
    notes: ['', Validators.maxLength(255)],
    products: this.fb.array([]),
    createdAt: [new Date()],
    totalPriceProducts: [0, Validators.required],
    labourValue: [0, Validators.required],
    totalPrice: [0, Validators.required],
    paymentMethod: ['', Validators.required],
  });
  ngOnInit(): void {
    this.editProposal();
  }
  onSubmit(): void {
    if (this.proposalForm.valid) {
      if (this.proposalId > 0) {
        this.updateProposal();
      }
      this.createProposal();
    } else {
      this.showMessageError();
    }
  }
  private editProposal() {
    this.getIdFromParams();
    if (this.proposalId > 0) {
      this.title = 'Editar proposta'
      this.spotSolarService.getById(this.proposalId).subscribe({
        next: (proposal: Proposal) => {
          this.fillFormWhenEdit(proposal);
        },
        error: () => {
          this.showMessageError();
        }
      });
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
  private updateProposal() {
    this.isLoading = true;
    this.spotSolarService.updateProposal(this.proposalForm.value).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showMessageError();
      },
    });
  }
  private getIdFromParams() {
    this.route.params.subscribe(params => {
      this.proposalId = parseInt(params['id']);
    });
  }
  private createProposal() {
    this.loadingService.show();
    this.spotSolarService
      .createProposal(this.proposalForm.value)
      .subscribe({
        next: (proposal: Proposal) => {
          this.loadingService.hide();
          Swal.fire({
            title: 'Proposta criada com sucesso!',
            icon: 'success',
            showConfirmButton: true,
            confirmButtonText: 'Ok',
            showDenyButton: true,
            denyButtonColor: '#4582DC',
            denyButtonText: 'Baixar proposta em PDF',
          }).then((result) => {
            if (result.isDenied) {
              this.viewProposalOnPDF();
            }
          });
        },
        error: (err) => {
          this.loadingService.hide();
          Swal.fire({
            title: 'Erro ao criar proposta!',
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          })
        }
      });
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
      rowKey: proposal?.rowKey,
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
      createdAt: proposal?.createdAt,
      totalPriceProducts: proposal?.totalPriceProducts,
      labourValue: proposal?.labourValue,
      totalPrice: proposal?.totalPrice,
      paymentMethod: proposal?.paymentMethod,
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
