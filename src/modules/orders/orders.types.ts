export interface CreateOrderInput {
  product: string;
  quantity: number;
}

export interface OrderOutput {
  id: number;
  product: string;
  quantity: number;
  createdAt: Date;
}