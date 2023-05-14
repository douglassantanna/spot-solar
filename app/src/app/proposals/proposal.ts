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
  customerFullName: string;
  email: string;
  telephoneNumber: string;
  notes: string;
  totalPrice: number;
  labourValue: number;
  warranty: Warranty;
  excecutionTime: number;
  address: Address;
  products: Product[];
}

export interface Address {
  zipCode: string;
  street: string;
  city: string;
  state: string;
  notes: string;
}
export interface Product {
  name: string;
  quantity: number;
}
export interface Warranty {
  qtd: number;
  type: WarrantyType;
}
export enum WarrantyType {
  MONTHS = 1,
  YEARS = 2
}
