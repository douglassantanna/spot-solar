export enum WarrantyType {
  MONTHS = 1,
  YEARS = 2
}
export enum ServiceType {
  INSTALACAOELETRICA = 1,
  INSTALACAOFOTOVOLTAICA = 2,
  MANUTENCAOELETRICA = 3,
  MANUTENCAOFOTOVOLTAICA = 4,
}
export interface Service {
  serviceType: ServiceType;
  warrantyType: WarrantyType;
  warrantyQtd: number;
  excecutionTime: number;
  power?: string;
}
