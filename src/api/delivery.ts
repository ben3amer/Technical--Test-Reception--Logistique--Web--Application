const BASE_URL = "https://localhost:7126/api/deliveries";

export async function getDelivery(orderId: string) {
  const res = await fetch(`${BASE_URL}/${orderId}`);
  if (!res.ok) throw new Error("Failed to fetch delivery");
  return res.json();
}

export async function receivePallet(orderId: string, palletId: string) {
  const res = await fetch(`${BASE_URL}/${orderId}/pallets/${palletId}/receive`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to receive pallet");
}

export async function receiveCarton(orderId: string, palletId: string, cartonId: string) {
  const res = await fetch(`${BASE_URL}/${orderId}/pallets/${palletId}/cartons/${cartonId}/receive`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to receive carton");
}

export async function receiveProduct(orderId: string, palletId: string, cartonId: string, productRef: string) {
  const res = await fetch(`${BASE_URL}/${orderId}/pallets/${palletId}/cartons/${cartonId}/products/${productRef}/receive`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to receive product");
}

export async function unreceiveProduct(orderId: string, palletId: string, cartonId: string, productRef: string) {
  const res = await fetch(`${BASE_URL}/${orderId}/pallets/${palletId}/cartons/${cartonId}/products/${productRef}/unreceive`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to unreceive product");
}