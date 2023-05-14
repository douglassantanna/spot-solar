import { Component, signal } from '@angular/core';
import { SpotSolarService } from 'src/app/services/spot-solar.service';

import { Proposal } from '../proposal';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {
  displayedColumns = ['id', 'customerFullName', 'email', 'telephoneNumber', 'totalPrice', 'createdAt', 'actions'];
  dataSource: Proposal[] = [];
  signalDataSource = signal<any[]>([]);
  constructor(private spotService: SpotSolarService) {
    this.getProposals();
  }

  private getProposals() {
    this.spotService
      .getProposals()
      .subscribe((data: Proposal[]) => {
        this.dataSource = data;
      });
  }
}
