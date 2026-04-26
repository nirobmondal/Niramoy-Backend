export interface ICreateReviewPayload {
  orderItemId: string;
  rating: number;
  comment?: string;
}

export interface IUpdateReviewPayload {
  rating?: number;
  comment?: string;
}
