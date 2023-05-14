import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2'
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SpotSolarService } from 'src/app/services/spot-solar.service';
import { Proposal } from '../proposal';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  private spotSolarService = inject(SpotSolarService);
  private fb = inject(FormBuilder);

  proposalForm = this.fb.group({
    createdAt: [new Date()],
    customerFullName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    telephoneNumber: [null, Validators.required],
    notes: [null, Validators.maxLength(255)],
    address: this.fb.group({
      zipCode: [null, Validators.required],
      street: [null, Validators.required],
      city: [null, Validators.required],
      state: [null, Validators.required],
      notes: [null, Validators.maxLength(255)],
    }),
    products: this.fb.array([]),
    totalPriceProducts: [null, Validators.required],
    totalPrice: [null],
    labourValue: [null, Validators.required],
    excecutionTime: [null, Validators.required],
    warranty: this.fb.group({
      qtd: [null, Validators.required],
      type: [null, Validators.required],
    }),
  });

  onSubmit(): void {
    this.totalPrice.setValue(this.sumTotalPrice());
    if (this.proposalForm.valid) {
      this.createProposal();
    } else {
      Swal.fire({
        title: 'Erro ao criar proposta!',
        text: 'Por favor, verifique se todos os campos foram preenchidos corretamente.',
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      })
    }
  }
  addProduct(): void {
    const product = this.fb.group({
      name: [null, Validators.required],
      qtd: [null, Validators.required],
    });
    this.products.push(product);
  }
  removeProduct(index: number): void {
    this.products.removeAt(index);
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
            denyButtonColor: '#3085d6',
            denyButtonText: 'Baixar proposta em PDF',
          })
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
  private sumTotalPrice(): number {
    let sum = 0;
    this.labourValue.value ? sum += this.labourValue.value : sum += 0;
    this.totalPriceProducts.value ? sum += this.totalPriceProducts.value : sum += 0;
    return sum;
  }
  get notes() {
    return this.proposalForm.get('notes') as FormControl;
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
}
