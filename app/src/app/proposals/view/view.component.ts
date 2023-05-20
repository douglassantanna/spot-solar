import { Component, signal, inject } from '@angular/core';
import { SpotSolarService } from 'src/app/services/spot-solar.service';

import { Proposal } from '../../interfaces/proposal';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewPdfComponent } from '../view-pdf/view-pdf.component';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {
  displayedColumns = ['id', 'customerFullName', 'email', 'telephoneNumber', 'totalPrice', 'createdAt', 'actions'];
  dataSource: Proposal[] = [];
  signalDataSource = signal<any[]>([]);
  private spotService = inject(SpotSolarService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  constructor() {
    this.getProposals();
  }

  private getProposals() {
    this.spotService
      .getProposals()
      .subscribe((data: Proposal[]) => {
        this.dataSource = data;
      });
  }
  editProposal(proposal: Proposal) {
    this.router.navigate(['/edit', proposal.id]);
  }
  viewPDF(proposal: Proposal) {
    const dialogRef = this.dialog.open(ViewPdfComponent, {
      data: proposal,
      width: '610px',
      height: '90%',
    })
  }
}
