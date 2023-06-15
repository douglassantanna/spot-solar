import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { Proposal } from '../interfaces/proposal';
import { Firestore, addDoc, collection, collectionData, doc, getDoc, updateDoc } from '@angular/fire/firestore';

const url = `${environment.urlApi}/proposal`;
@Injectable({
  providedIn: 'root'
})
export class SpotSolarService {

  constructor(private http: HttpClient,
    private firestore: Firestore) { }

  getById(id: string): BehaviorSubject<any> {
    const proposal$ = new BehaviorSubject<any>(null);
    const docInstance = doc(this.firestore, 'proposals', id);
    getDoc(docInstance)
      .then(res => {
        if (res.exists())
          proposal$.next(res.data());
      })
      .catch((error) => {
        proposal$.error({ error });
      });

    return proposal$;
  }

  getProposals(): Observable<any> {
    const collectionInstance = collection(this.firestore, 'proposals');
    return collectionData(collectionInstance, { idField: 'id' })
  }
  createProposal(data: any) {
    const collectionInstance = collection(this.firestore, 'proposals');
    addDoc(collectionInstance, data).then(res => { console.log(res) }).catch((error) => { console.log(error) })
  }
  updateProposal(data: any, id: string) {
    const docInstance = doc(this.firestore, 'proposals', id);
    const updatedProposal = {
      customerFullName: data.customerFullName,
      customerEmail: data.customerEmail,
    }
    updateDoc(docInstance, updatedProposal).then(res => { console.log(res) }).catch((error) => { console.log(error) })
  }
}
