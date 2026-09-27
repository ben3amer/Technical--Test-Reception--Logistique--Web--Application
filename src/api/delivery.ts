import apiClient from './client';
import type { DeliveryDto } from '../types/delivery';

export const getDelivery = async (orderId: string): Promise<DeliveryDto> => {
  const { data } = await apiClient.get<DeliveryDto>(`/delivery/${orderId}`);
  return data;
};

export const receivePallet = async (orderId: string, palletId: string): Promise<DeliveryDto> => {
  const { data } = await apiClient.post<DeliveryDto>(`/delivery/${orderId}/pallets/${palletId}/receive`);
  return data;
};

export const receiveCarton = async (orderId: string, palletId: string, cartonId: string): Promise<DeliveryDto> => {
  const { data } = await apiClient.post<DeliveryDto>(`/delivery/${orderId}/pallets/${palletId}/cartons/${cartonId}/receive`);
  return data;
};

export const receiveProduct = async (orderId: string, palletId: string, cartonId: string, productRef: string): Promise<DeliveryDto> => {
  const { data } = await apiClient.post<DeliveryDto>(`/delivery/${orderId}/pallets/${palletId}/cartons/${cartonId}/products/${productRef}/receive`);
  return data;
};

export const unreceiveProduct = async (orderId: string, palletId: string, cartonId: string, productRef: string): Promise<DeliveryDto> => {
  const { data } = await apiClient.delete<DeliveryDto>(`/delivery/${orderId}/pallets/${palletId}/cartons/${cartonId}/products/${productRef}/receive`);
  return data;
};
