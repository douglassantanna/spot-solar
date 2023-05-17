import { Component, inject } from '@angular/core';
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
export class CreateComponent {
  private dialog = inject(MatDialog);
  private spotSolarService = inject(SpotSolarService);
  private fb = inject(FormBuilder);

  proposalForm = this.fb.group({
    createdAt: [new Date()],
    customerFullName: ['douglas', Validators.required],
    email: ['douglas@teste.com', [Validators.required, Validators.email]],
    telephoneNumber: ['1145336969', Validators.required],
    notes: ['', Validators.maxLength(255)],
    address: this.fb.group({
      zipCode: ['13219110', Validators.required],
      street: ['rua dois', Validators.required],
      neighborhood: ['jardim das palmeiras', Validators.required],
      city: ['jundiai', Validators.required],
      state: ['sp', Validators.required],
      notes: ['portao branco', Validators.maxLength(255)],
    }),
    products: this.fb.array([
      this.fb.group({
        name: ['cabo amarelo', Validators.required],
        quantity: [3, Validators.required],
      }),
      this.fb.group({
        name: ['painel solar', Validators.required],
        quantity: [3, Validators.required],
      }),
    ]),
    power: [3.9, Validators.required],
    totalPriceProducts: [1500, Validators.required],
    totalPrice: [null],
    labourValue: [3500, Validators.required],
    excecutionTime: [3, Validators.required],
    warranty: this.fb.group({
      qtd: [20, Validators.required],
      type: [1, Validators.required],
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
      quantity: [null, Validators.required],
    });
    this.products.push(product);
  }
  removeProduct(index: number): void {
    this.products.removeAt(index);
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
  private createProposal() {
    Swal.fire({
      title: 'Proposta criada com sucesso!',
      icon: 'success',
      showConfirmButton: true,
      confirmButtonText: 'Ok',
      showDenyButton: true,
      denyButtonColor: '#3085d6',
      denyButtonText: 'Ver proposta',
    }).then((result) => {
      if (result.isDenied) {
        this.viewProposalOnPDF();
      }
    });
    // this.spotSolarService
    //   .createProposal(this.proposalForm.value)
    //   .subscribe({
    //     next: (proposal: Proposal) => {
    //       Swal.fire({
    //         title: 'Proposta criada com sucesso!',
    //         icon: 'success',
    //         showConfirmButton: true,
    //         confirmButtonText: 'Ok',
    //         showDenyButton: true,
    //         denyButtonColor: '#3085d6',
    //         denyButtonText: 'Baixar proposta em PDF',
    //       }).then((result) => {
    //         if (result.isDenied) {
    //           this.viewProposalOnPDF();
    //         }
    //       });
    //     },
    //     error: (err) => {
    //       Swal.fire({
    //         title: 'Erro ao criar proposta!',
    //         icon: 'error',
    //         showCancelButton: false,
    //         confirmButtonText: 'Ok',
    //       })
    //     }
    //   });

  }
  private sumTotalPrice(): number {
    let sum = 0;
    this.labourValue.value ? sum += this.labourValue.value : sum += 0;
    this.totalPriceProducts.value ? sum += this.totalPriceProducts.value : sum += 0;
    return sum;
  }
  private viewProposalOnPDF(): void {
    const dialogRef = this.dialog.open(ViewPdfComponent, {
      data: this.proposalForm.value,
      width: '610px',
      height: '90%',
    })
  }
}
