export type ReceptionStatus = 'NotReceived' | 'PartiallyReceived' | 'Received';

export interface ReceptionProgressDto {
  totalItems: number;
  receivedItems: number;
}

export interface ProductDto {
  ref: string;
  name: string;
  color: string;
  size: string;
  expectedQuantity: number;
  receivedQuantity: number;
  status: ReceptionStatus;
}

export interface CartonDto {
  id: string;
  status: ReceptionStatus;
  products: ProductDto[];
}

export interface PalletDto {
  id: string;
  status: ReceptionStatus;
  cartons: CartonDto[];
}

export interface DeliveryDto {
  orderId: string;
  status: ReceptionStatus;
  progress: ReceptionProgressDto;
  pallets: PalletDto[];
}
