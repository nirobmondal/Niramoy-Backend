export interface ICreateMedicinePayload {
  name: string;
  description?: string;
  price: number;
  stock: number;
  dosageForm: string;
  strength: string;
  categoryId: string;
  manufacturerId: string;
  imageUrl?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
}

export interface IUpdateMedicinePayload {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  dosageForm?: string;
  strength?: string;
  categoryId?: string;
  manufacturerId?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
}
