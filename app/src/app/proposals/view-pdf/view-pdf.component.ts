import { Component, OnInit, Inject } from '@angular/core';
import { Proposal } from '../../interfaces/proposal';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jsPDF } from "jspdf";
import { ElementRef, ViewChild } from '@angular/core';
@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.scss']
})
export class ViewPdfComponent implements OnInit {
  isLoading = false;
  @ViewChild('content') content!: ElementRef;
  constructor(
    @Inject(MAT_DIALOG_DATA) public proposal: Proposal
  ) { }

  ngOnInit(): void {
    console.log(this.proposal)
  }
  printPDF() {
    this.isLoading = true;
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.html(this.content.nativeElement, {
      callback: (doc) => {
        doc.save(`proposta-${this.proposal.customer.customerFullName}`);
        this.isLoading = false;
      }
    });
  }
}
