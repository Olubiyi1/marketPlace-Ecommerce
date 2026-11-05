export type CreateProductData = {
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
};

export type UpdateProductData = {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  quantity?: number;
  image?: string;
};