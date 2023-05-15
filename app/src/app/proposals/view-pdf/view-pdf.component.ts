import { Component, OnInit, Inject } from '@angular/core';
import { Proposal } from '../proposal';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.scss']
})
export class ViewPdfComponent implements OnInit {
  displayedColumns: string[] = ['name', 'quantity'];
  constructor(
    @Inject(MAT_DIALOG_DATA) public proposal: Proposal
  ) { }
  ngOnInit(): void {
    console.log(this.proposal)
  }
}
