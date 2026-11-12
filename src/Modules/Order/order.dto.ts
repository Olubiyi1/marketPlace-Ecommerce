export interface CreateOrderDTO{
  items: {
    productId: string;
    quantity: number;
  }[];
}
