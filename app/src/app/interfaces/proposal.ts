import { Address, Customer } from "./customer";
import { Product } from "./product";
import { Service } from "./service";

export interface ProposalResponse {
  count: number;
  next: string;
  previous: string;
  proposals: ViewProposal[];
}
export interface ViewProposal {
  id: number;
  customerFullName: string;
  customerEmail: string;
  cellphone: string;
  power: string;
  price: number;
  date: string;
}
export interface Proposal {
  customerFullName: string;
  customerEmail: string;
  customerTelephoneNumber: string;
  serviceType: number;
  warrantyType: number;
  warrantyQtd: number;
  excecutionTime: number;
  power: string;
  zipCode: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  products: Product[];
  createdAt: Date;
  totalPriceProducts: number;
  labourValue: number;
  totalPrice: number;
  notes: string;
  partitionKey: string;
  rowKey: string;
  paymentMethod: string;
}


