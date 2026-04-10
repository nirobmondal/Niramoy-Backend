export interface ICreateMedicinePayload {
  name: string;
  description?: string;
  dosageForm?: string;
  imageUrl?: string;
  strength?: string;
  categoryId: string;
  manufacturerId: string;
  price: number;
  stock: number;
}

export interface IUpdateMedicinePayload {
  name?: string;
  description?: string;
  dosageForm?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  strength?: string;
  categoryId?: string;
  manufacturerId?: string;
  price?: number;
  stock?: number;
}
