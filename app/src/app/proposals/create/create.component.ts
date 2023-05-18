import { Component, OnInit, inject } from '@angular/core';
import Swal from 'sweetalert2'
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SpotSolarService } from 'src/app/services/spot-solar.service';
import { Proposal } from '../proposal';
import { MatDialog } from '@angular/material/dialog';
import { ViewPdfComponent } from '../view-pdf/view-pdf.component';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  ngOnInit(): void {
    this.sumTotalPrice();
  }
  private dialog = inject(MatDialog);
  private spotSolarService = inject(SpotSolarService);
  private fb = inject(FormBuilder);

  proposalForm = this.fb.group({
    id: [0],
    customer: this.fb.group({
      customerFullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephoneNumber: ['', Validators.required],
    }),
    service: this.fb.group({
      serviceType: [0, Validators.required],
      warrantyType: [0, Validators.required],
      warrantyQtd: [0, Validators.required],
      excecutionTime: [0, Validators.required],
      power: [0],
    }),
    address: this.fb.group({
      zipCode: [' ', Validators.required],
      street: ['  ', Validators.required],
      neighborhood: ['  ', Validators.required],
      city: ['  ', Validators.required],
      state: [' ', Validators.required],
      notes: [' ', Validators.maxLength(255)],
    }),
    products: this.fb.array([]),
    createdAt: [new Date()],
    totalPriceProducts: [null, Validators.required],
    labourValue: [null, Validators.required],
    totalPrice: [0, Validators.required],
    notes: ['', Validators.maxLength(255)],
  });

  onSubmit(): void {
    if (this.proposalForm.valid) {
      this.createProposal();
    } else {
      this.showMessageError();
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
  private createProposal() {
    this.spotSolarService
      .createProposal(this.proposalForm.value)
      .subscribe({
        next: (proposal: Proposal) => {
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
  get customer() {
    return this.proposalForm.get('customer') as FormControl;
  }
  get customerFullName() {
    return this.customer.get('customerFullName') as FormControl;
  }
  get email() {
    return this.customer.get('email') as FormControl;
  }
  get telephoneNumber() {
    return this.customer.get('telephoneNumber') as FormControl;
  }
}
