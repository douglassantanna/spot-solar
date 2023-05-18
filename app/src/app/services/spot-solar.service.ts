import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { Proposal } from '../interfaces/proposal';

const url = `${environment.urlApi}/proposals`;
@Injectable({
  providedIn: 'root'
})
export class SpotSolarService {

  constructor(private http: HttpClient) { }

  getById(id: number): Observable<Proposal> {
    return this.http.get<Proposal>(`${url}/${id}`);
  }
  getProposals(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${url}`);
  }
  createProposal(proposal: any): Observable<Proposal> {
    return this.http.post<Proposal>(`${url}`, proposal);
  }
  updateProposal(proposal: any): Observable<Proposal> {
    return this.http.put<Proposal>(`${url}/${proposal.id}`, proposal);
  }
}
