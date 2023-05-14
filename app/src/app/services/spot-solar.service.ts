import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { Proposal } from '../proposals/proposal';

const url = `${environment.urlApi}/proposals`;
@Injectable({
  providedIn: 'root'
})
export class SpotSolarService {

  constructor(private http: HttpClient) { }

  getProposals(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${url}`);
  }
  createProposal(proposal: any): Observable<Proposal> {
    return this.http.post<Proposal>(`${url}`, proposal);
  }
}
