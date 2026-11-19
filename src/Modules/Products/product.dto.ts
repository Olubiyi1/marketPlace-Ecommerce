export type CreateProductData = {
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
};

export type UpdateProductData = {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  image?: string;
};