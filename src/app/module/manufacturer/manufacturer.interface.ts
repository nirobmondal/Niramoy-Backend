export interface ICreateManufacturerPayload {
  name: string;
  country?: string;
}

export interface IUpdateManufacturerPayload {
  name?: string;
  country?: string;
}
