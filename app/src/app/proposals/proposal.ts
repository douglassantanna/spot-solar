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
  code: string;
  customerFullName: string;
  customerEmail: string;
  cellphone: string;
  power: string;
  price: number;
  date: string;
}
export interface Proposal {
  id: number;
  customer: Customer;
  service: Service;
  address: Address;
  products: Product[];
  createdAt: Date;
  totalPriceProducts: number;
  totalPrice: number;
  labourValue: number;
  paymentMethod: string;
  notes: string;
}


