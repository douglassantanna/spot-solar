import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { Proposal } from '../interfaces/proposal';

const url = `${environment.urlApi}/proposal`;
@Injectable({
  providedIn: 'root'
})
export class SpotSolarService {

  constructor(private http: HttpClient) { }

  getById(rowKey: string): Observable<Proposal> {
    console.log(rowKey);

    return this.http.get<Proposal>(`${url}/get-by-id/${rowKey}`);
  }
  getProposals(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${url}/get-all`);
  }
  createProposal(data: any): Observable<Proposal> {
    let proposal = {
      ...data,
    } as Proposal;
    return this.http.post<Proposal>(`${url}/create-proposal`, proposal);
  }
  updateProposal(data: any): Observable<Proposal> {
    let proposal = {
      ...data,
    } as Proposal;
    return this.http.put<Proposal>(`${url}/update-proposal/${proposal.rowKey}`, proposal);
  }
}
